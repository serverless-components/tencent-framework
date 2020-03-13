# Tencent Framework Serverless Component

[![npm](https://img.shields.io/npm/v/%40serverless%2Ftencent-framework)](http://www.npmtrends.com/%40serverless%2Ftencent-framework)
[![NPM downloads](http://img.shields.io/npm/dm/%40serverless%2Ftencent-framework.svg?style=flat-square)](http://www.npmtrends.com/%40serverless%2Ftencent-framework)

[简体中文](https://github.com/serverless-components/tencent-framework/blob/master/README.md) | English

## Introduction

Framework Serverless Component for Tencent Cloud, it provides foundation management for cloud Baas production. You can develop a framework component quickly by using it.

## Content

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)
5. [Remove](#5-Remove)

### 1. Install

Install the Serverless Framework globally:

```bash
$ npm install -g serverless
```

### 2. Create

In project root, create the following simple boilerplate:

```bash
$ touch serverless.yml
$ touch .env           # your Tencent api keys
```

Add the access keys of a [Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with `AdministratorAccess` in the `.env` file, using this format:

```
# .env
TENCENT_SECRET_ID=XXX
TENCENT_SECRET_KEY=XXX
```

- If you don't have a Tencent Cloud account, you could [sign up](https://intl.cloud.tencent.com/register) first.

### 3. Configure

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

- [More Options](https://github.com/serverless-components/tencent-framework/blob/master/docs/configure.md)

### 4. Deploy

#### 4.1 Build static assets

```bash
$ npm run build
```

#### 4.2 Deploy to cloud

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

> Notice: `sls` is short for `serverless` command.

&nbsp;

### 5. Remove

```bash
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Removed function framework-function successful
  DEBUG ─ Removing any previously deployed API. api-7hwektu6
  DEBUG ─ Removing any previously deployed service. service-jflj67ms

  7s › myFramework › done
```

### More Components

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
