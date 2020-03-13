# Configure document

## Complete configuration

```yml
# serverless.yml

myFramework:
  component: '@serverless/tencent-framework'
  inputs:
    framework: egg
    handler: app.handler
    region: ap-guangzhou
    functionName: framework-function
    serviceName: mytest
    serviceId: service-np1uloxw
    code: ./
    exclude:
      - .gitignore
      - .git/**
      - node_modules/**
      - .serverless
      - .env
    include:
      - ./myFunction1.zip
    functionConf:
      timeout: 10
      memorySize: 128
      environment:
        variables:
          TEST: vale
      vpcConfig:
        subnetId: ''
        vpcId: ''
    apigatewayConf:
      customDomain:
        - domain: abc.com
          certificateId: abcdefg
          isDefaultMapping: 'FALSE'
          pathMappingSet:
            - path: /
              environment: release
          protocols:
            - http
            - https
      protocols:
        - http
        - https
      environment: test
      usagePlan:
        usagePlanId: 1111
        usagePlanName: slscmp
        usagePlanDesc: sls create
        maxRequestNum: 1000
      auth:
        serviceTimeout: 15
        secretName: secret
        secretIds:
          - abc
    cloudDNSConf:
      ttl: 603
      status: enable
    ap-guangzhou:
      functionConf:
        timeout: 20
      apigatewayConf:
        protocols:
          - https
      cloudDNSConf:
        recordLine:
          - 电信
          - 联通
```

## Configuration description

Main param description

| Param                                                      | Required/Optional |   Default    | Description                                                          |
| ---------------------------------------------------------- | :---------------: | :----------: | :------------------------------------------------------------------- |
| framework                                                  |     Optional      | ap-guangzhou |                                                                      |
| region                                                     |     Optional      | ap-guangzhou |                                                                      |
| functionName                                               |     Optional      |              | ServerlessCloudFunction Name                                         |
| serviceName                                                |     Optional      |              | API-Gateway service name, default to create a new serivce            |
| serviceId                                                  |     Optional      |              | API-Gateway service id, if it has will use this APII-Gateway service |
| code                                                       |     Optional      |              | Default is current working directory                                 |
| handler                                                    |     Required      |              | Name of the handler.                                                 |
| runtime                                                    |     Required      |              | Runtime environment of the function;                                 |
| exclude                                                    |     Optional      |              | exclude file                                                         |
| include                                                    |     Optional      |              | include file, if relative path, should relative to `serverless.yml`  |
| [functionConf](#funtionConf-param-description)             |     Optional      |              | Function configure                                                   |
| [apigatewayConf](#apigatewayConf-param-description)        |     Optional      |              | API-Gateway configure                                                |
| [cloudDNSConf](#cloudDNSConf-param-description)            |     Optional      |              | Special config for region                                            |
| [Region special config](#apigatewayConf-param-description) |     Optional      |              | Special config for region. Use region name for key                   |

### cloudDNSConf param description

| Param      | Required/Optional | Default | Description                    |
| ---------- | :---------------: | :-----: | :----------------------------- |
| ttl        |     Optional      |   600   | TTL, support value: 1 - 604800 |
| recordLine |     Optional      |         | record line                    |

### Region special config

| Param | Required/Optional | Default | Description |
| [functionConf](#funtionConf-param-description) | Optional | | Function configure |
| [apigatewayConf](#apigatewayConf-param-description) | Optional | | API-Gateway configure |
| [cloudDNSConf](#cloudDNSConf-param-description) | Optional | | Special config for region |

### funtionConf param description

| Param       | Required/Optional | Default | Description                                                                                                                                     |
| ----------- | :---------------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| timeout     |     Optional      |   3s    | The duration a function allowed to execute. Choose a value between 1 and 300 seconds; The default is 3 seconds.                                 |
| memorySize  |     Optional      |  128M   | The size of memory size available to the function during execution. Specify a value between 128 MB (default) and 1,536 MB in 128 MB increments. |
| environment |     Optional      |         | Environment variable of the function                                                                                                            |
| vpcConfig   |     Optional      |         | VPC configuration of the function                                                                                                               |

- environment param description

| Param     | Description                |
| --------- | :------------------------- |
| variables | Environment variable array |

- vpcConfig param description

| Param    | Description      |
| -------- | :--------------- |
| subnetId | ID of the VPC    |
| vpcId    | ID of the subnet |

### apigatewayConf param description

| Param        | Required/Optional | Description                                                                                              |
| ------------ | :---------------: | :------------------------------------------------------------------------------------------------------- |
| protocols    |     Optional      | Frontend request type of the service, such as HTTP, HTTPS, HTTP and HTTPS.                               |
| environment  |     Optional      | The name of the environment to be published. Three environments are supported: test, prepub and release. |
| usagePlan    |     Optional      |                                                                                                          |
| auth         |     Optional      |                                                                                                          |
| customDomain |     Optional      | Custom API Domain                                                                                        |

- usagePlan param description

| Param         | Description                                                                                                   |
| ------------- | :------------------------------------------------------------------------------------------------------------ |
| usagePlanId   | User-defined usage plan id                                                                                    |
| usagePlanName | User-defined usage plan name                                                                                  |
| usagePlanDesc | User-defined usage plan description                                                                           |
| maxRequestNum | Total number of requests allowed. If this is left empty, -1 will be used by default, indicating it’s disabled |

- auth param description

| Param          | Description       |
| -------------- | :---------------- |
| serviceTimeout | Service timeout   |
| secretName     | Secret name       |
| secretIds      | Secret Id (Array) |

### apigatewayConf.customDomain param description

| Param            | Required/Optional | Default  | Description                                                                                               |
| ---------------- | :---------------: | :------: | :-------------------------------------------------------------------------------------------------------- |
| domain           |     Required      |          | custom domain to bind.                                                                                    |
| certificateId    |     Optional      |          | Certificate for custom domain, if set https, it is required.                                              |
| isDefaultMapping |     Optional      | `'TRUE'` | Whether using default path mapping. If want to customize path mapping, set to `FALSE`                     |
| pathMappingSet   |     Optional      |   `[]`   | Custom path mapping, when `isDefaultMapping` is `FALSE`, it is required.                                  |
| protocol         |     Optional      |          | Bind custom domain protocol type, such as HTTP, HTTPS, HTTP and HTTPS, default same as frontend protocols |

- pathMappingSet

| Param       | Description                   |
| ----------- | :---------------------------- |
| path        | Customize mapping path        |
| environment | Customize mapping environment |
