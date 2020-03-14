const ensureIterable = require('type/iterable/ensure')
const ensureString = require('type/string/ensure')
const random = require('ext/string/random')
const { Component } = require('@serverless/core')

const DEFAULTS = {
  handler: 'index.main_handler',
  runtime: 'Nodejs8.9',
  exclude: ['.git/**', '.gitignore', '.DS_Store'],
  timeout: 3,
  memorySize: 128
}

class TencentFramework extends Component {
  getDefaultProtocol(protocols) {
    if (protocols.map((i) => i.toLowerCase()).includes('https')) {
      return 'https'
    }
    return 'http'
  }

  mergeJson(sourceJson, targetJson) {
    for (const eveKey in sourceJson) {
      if (targetJson.hasOwnProperty(eveKey)) {
        if (['protocols', 'endpoints', 'customDomain'].indexOf(eveKey) != -1) {
          for (let i = 0; i < sourceJson[eveKey].length; i++) {
            const sourceEvents = JSON.stringify(sourceJson[eveKey][i])
            const targetEvents = JSON.stringify(targetJson[eveKey])
            if (targetEvents.indexOf(sourceEvents) == -1) {
              targetJson[eveKey].push(sourceJson[eveKey][i])
            }
          }
        } else {
          if (typeof sourceJson[eveKey] != 'string') {
            this.mergeJson(sourceJson[eveKey], targetJson[eveKey])
          } else {
            targetJson[eveKey] = sourceJson[eveKey]
          }
        }
      } else {
        targetJson[eveKey] = sourceJson[eveKey]
      }
    }
    return targetJson
  }

  capitalString(str) {
    if (str.length < 2) {
      return str.toUpperCase()
    }

    return `${str[0].toUpperCase()}${str.slice(1)}`
  }

  async prepareInputs(inputs = {}) {
    // 对function inputs进行标准化
    const tempFunctionConf = inputs.functionConf ? inputs.functionConf : undefined
    const { framework } = inputs
    const fromClientRemark = `tencent-${framework}`

    const functionConf = {
      name:
        ensureString(inputs.functionName, { isOptional: true }) ||
        this.state.functionName ||
        `${framework}_component_${random({ length: 6 })}`,
      codeUri:
        ensureString(
          tempFunctionConf && tempFunctionConf.code ? tempFunctionConf.code : inputs.code,
          { isOptional: true }
        ) || process.cwd(),
      region: inputs.region
        ? typeof inputs.region == 'string'
          ? [inputs.region]
          : inputs.region
        : ['ap-guangzhou'],
      handler: ensureString(
        tempFunctionConf && tempFunctionConf.handler ? tempFunctionConf.handler : inputs.handler,
        { default: DEFAULTS.handler }
      ),
      runtime: ensureString(
        tempFunctionConf && tempFunctionConf.runtime ? tempFunctionConf.runtime : inputs.runtime,
        { default: DEFAULTS.runtime }
      ),
      fromClientRemark
    }
    functionConf.include = ensureIterable(
      tempFunctionConf && tempFunctionConf.include ? tempFunctionConf.include : inputs.include,
      { default: [], ensureItem: ensureString }
    )
    functionConf.exclude = ensureIterable(
      tempFunctionConf && tempFunctionConf.exclude ? tempFunctionConf.exclude : inputs.exclude,
      { default: [], ensureItem: ensureString }
    )
    functionConf.exclude.push('.git/**', '.gitignore', '.serverless', '.DS_Store')
    if (inputs.functionConf) {
      functionConf.timeout = inputs.functionConf.timeout
        ? inputs.functionConf.timeout
        : DEFAULTS.timeout
      functionConf.memorySize = inputs.functionConf.memorySize
        ? inputs.functionConf.memorySize
        : DEFAULTS.memorySize
      if (inputs.functionConf.environment) {
        functionConf.environment = inputs.functionConf.environment
      }
      if (inputs.functionConf.vpcConfig) {
        functionConf.vpcConfig = inputs.functionConf.vpcConfig
      }
    }

    // 对apigw inputs进行标准化
    const apigatewayConf = inputs.apigatewayConf ? inputs.apigatewayConf : {}
    apigatewayConf.fromClientRemark = fromClientRemark
    apigatewayConf.serviceName = inputs.serviceName
    apigatewayConf.description = `Serverless Framework Tencent-${this.capitalString(
      framework
    )} Component`
    apigatewayConf.serviceId = inputs.serviceId
    apigatewayConf.region = functionConf.region
    apigatewayConf.protocols = apigatewayConf.protocols || ['http']
    apigatewayConf.environment = apigatewayConf.environment ? apigatewayConf.environment : 'release'
    apigatewayConf.endpoints = [
      {
        path: '/',
        method: 'ANY',
        function: {
          isIntegratedResponse: true,
          functionName: functionConf.name,
          functionNamespace: functionConf.namespace
        }
      }
    ]

    // 对cns inputs进行标准化
    const tempCnsConf = {}
    const tempCnsBaseConf = inputs.cloudDNSConf ? inputs.cloudDNSConf : {}

    // 分地域处理functionConf/apigatewayConf/cnsConf
    for (let i = 0; i < functionConf.region.length; i++) {
      const curRegion = functionConf.region[i]
      const curRegionConf = inputs[curRegion]
      if (curRegionConf && curRegionConf.functionConf) {
        functionConf[curRegion] = curRegionConf.functionConf
      }
      if (curRegionConf && curRegionConf.apigatewayConf) {
        apigatewayConf[curRegion] = curRegionConf.apigatewayConf
      }

      const tempRegionCnsConf = this.mergeJson(
        tempCnsBaseConf,
        curRegionConf && curRegionConf.cloudDNSConf ? curRegionConf.cloudDNSConf : {}
      )

      tempCnsConf[functionConf.region[i]] = {
        recordType: 'CNAME',
        recordLine: tempRegionCnsConf.recordLine ? tempRegionCnsConf.recordLine : undefined,
        ttl: tempRegionCnsConf.ttl,
        mx: tempRegionCnsConf.mx,
        status: tempRegionCnsConf.status ? tempRegionCnsConf.status : 'enable'
      }
    }

    const cnsConf = []
    // 对cns inputs进行检查和赋值
    if (apigatewayConf.customDomain && apigatewayConf.customDomain.length > 0) {
      for (let domianNum = 0; domianNum < apigatewayConf.customDomain.length; domianNum++) {
        const tencentDomain = await this.load('@serverless/tencent-domain')
        const domainData = await tencentDomain.check({
          domain: apigatewayConf.customDomain[domianNum].domain
        })
        const tempInputs = {
          domain: domainData.domain,
          records: []
        }
        for (let eveRecordNum = 0; eveRecordNum < functionConf.region.length; eveRecordNum++) {
          if (tempCnsConf[functionConf.region[eveRecordNum]].recordLine) {
            tempInputs.records.push({
              subDomain: domainData.subDomain || '@',
              recordType: 'CNAME',
              recordLine: tempCnsConf[functionConf.region[eveRecordNum]].recordLine,
              value: `temp_value_about_${functionConf.region[eveRecordNum]}`,
              ttl: tempCnsConf[functionConf.region[eveRecordNum]].ttl,
              mx: tempCnsConf[functionConf.region[eveRecordNum]].mx,
              status: tempCnsConf[functionConf.region[eveRecordNum]].status || 'enable'
            })
          }
        }
        cnsConf.push(tempInputs)
      }
    }

    return {
      region: functionConf.region,
      functionConf: functionConf,
      apigatewayConf: apigatewayConf,
      cnsConf: cnsConf
    }
  }

  async default(inputs = {}) {
    const { region, functionConf, apigatewayConf, cnsConf } = await this.prepareInputs(inputs)

    const tencentCloudFunction = await this.load('@serverless/tencent-scf-multi-region', 'function')
    const tencentApiGateway = await this.load(
      '@serverless/tencent-apigateway-multi-region',
      'apigateway'
    )

    const functionOutputs = await tencentCloudFunction(functionConf)

    const outputs = {
      functionName: functionConf.name,
      functionOutputs
    }

    // if not disable, then create apigateway
    if (!apigatewayConf.isDisabled) {
      const tencentApiGatewayOutputs = await tencentApiGateway(apigatewayConf)

      const cnsRegion = {}

      if (region.length == 1) {
        const [curRegion] = region
        outputs.region = curRegion
        const curApigwOutput = tencentApiGatewayOutputs[curRegion]
        outputs.apiGatewayServiceId = curApigwOutput.serviceId
        outputs.url = `${this.getDefaultProtocol(curApigwOutput.protocols)}://${
          curApigwOutput.subDomain
        }/${curApigwOutput.environment}/`
        cnsRegion[curRegion] = curApigwOutput.subDomain
      } else {
        for (let i = 0; i < region.length; i++) {
          const curRegion = region[i]
          const curApigwOutput = tencentApiGatewayOutputs[curRegion]
          const tempData = {
            apiGatewayServiceId: curApigwOutput.serviceId,
            url: `${this.getDefaultProtocol(curApigwOutput.protocols)}://${
              curApigwOutput.subDomain
            }/${curApigwOutput.environment}/`
          }
          cnsRegion[curRegion] = curApigwOutput.subDomain
          outputs[curRegion] = tempData
        }
      }

      outputs.cns = []
      for (let i = 0; i < cnsConf.length; i++) {
        const curCns = cnsConf[i]
        for (let j = 0; j < curCns.records.length; j++) {
          curCns.records[j].value =
            cnsRegion[curCns.records[j].value.replace('temp_value_about_', '')]
        }
        const tencentCns = await this.load('@serverless/tencent-cns', curCns.domain)
        const tencentCnsOutputs = await tencentCns(curCns)
        if (tencentCnsOutputs.DNS) {
          outputs.DNS = tencentCnsOutputs.DNS
        }
        outputs.cns.push(curCns.domain)
      }
    }

    this.state = outputs
    await this.save()
    return outputs
  }

  async remove(inputs = {}) {
    const { framework } = inputs
    const fromClientRemark = `tencent-${framework}`
    const removeInput = {
      fromClientRemark
    }

    const tencentCloudFunction = await this.load('@serverless/tencent-scf-multi-region', 'function')
    const tencentApiGateway = await this.load(
      '@serverless/tencent-apigateway-multi-region',
      'apigateway'
    )

    await tencentCloudFunction.remove(removeInput)
    await tencentApiGateway.remove(removeInput)

    const { cns } = this.state
    if (cns && cns.length > 0) {
      for (let i = 0; i < cns.length; i++) {
        const tencentCns = await this.load('@serverless/tencent-cns', this.state.cns[i])
        await tencentCns.remove(removeInput)
      }
    }

    this.state = {}
    await this.save()

    return {}
  }
}

module.exports = TencentFramework
