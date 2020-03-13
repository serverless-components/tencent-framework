# 腾讯云 Framework Serverless Component

[![npm](https://img.shields.io/npm/v/%40serverless%2Ftencent-framework)](http://www.npmtrends.com/%40serverless%2Ftencent-framework)
[![NPM downloads](http://img.shields.io/npm/dm/%40serverless%2Ftencent-framework.svg?style=flat-square)](http://www.npmtrends.com/%40serverless%2Ftencent-framework)

简体中文 | [English](https://github.com/serverless-components/tencent-framework/blob/master/README.en.md)

## 简介

腾讯云 Framework Serverless Component，为框架类型组件提供基层管理部署云 Baas 产品能力，基于 Framework 组件，你可以非常轻松封装框架级别的组件。

## 目录

1. [安装](#1-安装)
2. [配置](#2-配置)
3. [部署](#3-部署)
4. [移除](#4-移除)

### 1. 安装

通过 npm 全局安装 [serverless cli](https://github.com/serverless/serverless)

```bash
$ npm install -g serverless
```

### 2. 配置

在项目根目录创建 `serverless.yml` 文件，在其中进行如下配置

```bash
$ touch serverless.yml
```

```yml
# serverless.yml
myFramework:
  component: '@serverless/tencent-framework'
  inputs:
    framework: test
    functionName: framework-function
    region: ap-guangzhou
    handler: app.handler
    runtime: Nodejs8.9
    code: ./
    functionConf:
      timeout: 30
      memorySize: 128
    environment:
      variables:
        RUN_ENV: test
    apigatewayConf:
      protocols:
        - http
        - https
      environment: release
```

- [更多配置](https://github.com/serverless-components/tencent-framework/tree/master/docs/configure.md)

### 3. 部署

#### 3.1 构建静态资源

```bash
$ npm run build
```

#### 3.2 部署到云端

如您的账号未 [登陆](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，您可以直接通过 `微信` 扫描命令行中的二维码进行授权登陆和注册。

通过 `sls` 命令进行部署，并可以添加 `--debug` 参数查看部署过程中的信息

```bash
$ sls --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Compressing function framework-function file to /Users/yugasun/Desktop/Develop/serverless/tencent-framework/example/.serverless/framework-function.zip.
  DEBUG ─ Compressed function framework-function file successful
  DEBUG ─ Uploading service package to cos[sls-cloudfunction-ap-guangzhou-code]. sls-cloudfunction-default-framework-function-1584093126.zip
  DEBUG ─ Uploaded package successful /Users/yugasun/Desktop/Develop/serverless/tencent
-framework/example/.serverless/framework-function.zip
  DEBUG ─ Creating function framework-function
  framework-function [████████████████████████████████████████] 100% | ETA: 0s | Speed: 3.83k/s
  DEBUG ─ Updating code...
  DEBUG ─ Updating configure...
  DEBUG ─ Created function framework-function successful
  DEBUG ─ Setting tags for function framework-function
  DEBUG ─ Creating trigger for function framework-function
  DEBUG ─ Deployed function framework-function successful
  DEBUG ─ Starting API-Gateway deployment with name ap-guangzhou-apigateway in the ap-guangzhou region
  DEBUG ─ Using last time deploy service id service-jflj67ms
  DEBUG ─ Updating service with serviceId service-jflj67ms.
  DEBUG ─ Endpoint ANY / already exists with id api-7hwektu6.
  DEBUG ─ Updating api with api id api-7hwektu6.
  DEBUG ─ Service with id api-7hwektu6 updated.
  DEBUG ─ Deploying service with id service-jflj67ms.
  DEBUG ─ Deployment successful for the api named ap-guangzhou-apigateway in the ap-guangzhou region.

  myFramework:
    functionName:        framework-function
    cns:                 (empty array)
    region:              ap-guangzhou
    apiGatewayServiceId: service-jflj67ms
    url:                 https://service-jflj67ms-1251556596.gz.apigw.tencentcs.com/release/

  17s › myFramework › done
```

> 注意: `sls` 是 `serverless` 命令的简写。

### 4. 移除

通过以下命令移除部署的 API 网关

```bash
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removed function framework-function successful
  DEBUG ─ Removing any previously deployed API. api-7hwektu6
  DEBUG ─ Removing any previously deployed service. service-jflj67ms

  7s › myFramework › done
```

### 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```bash
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存

如果没有腾讯云账号，可以在此 [注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 `SecretId` 和`SecretKey`.

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

### 更多组件

可以在 [Serverless Components](https://github.com/serverless/components) repo 中查询更多组件的信息。

### FAQ

1. [为什么不需要入口文件了？](https://github.com/serverless-components/tencent-framework/issues/1)
