![cover_image](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_jpg%2FJgLDtnLQIFfyu2RM6TskXsNsYmlicMoLlGPibxvuJuLw0AxQyZoGpUICJyedzzyzNFFib72icsOZ1JMvSEwAYkqovfFiaicNFyOTiaWAHjibX5mf3XY%2F0%3Fwx_fmt%3Djpeg) 

# 免费 claude code、codex API 每日100 万 Tokens 免费用

注册用户每日可获得免费调用额度，适合日常开发测试与轻量使用。

当前免费模型

Claude Code（anthropic\_messages 协议）

cli2api/claude-sonnet-4-6:free cli2api/claude-haiku-4-5-20251001:free

Codex（openai\_responses 协议）

cli2api/gpt-5.3-codex:free

操作步骤

**第一步：注册**  
打开下面网址，点击右上角 注册  
https://community.poixe.com/t/topic/201

![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FJgLDtnLQIFdqbFC91IunUGiaSYSmOOT7y5lFckjWARCccxpndPTD1lcdicsYqSAicxllgrbgm5aF6uVkxLrlKFPiagMgrbibCVSDGia0vypeKUxLc%2F640%3Fwx_fmt%3Dpng)

**第二步：完成注册**  
可使用 Google 账号 或 电子邮箱 进行注册。

![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FJgLDtnLQIFcahVMgmgVwg09OGIGHkXbBUYoAahr6P9h5zeGP7VStEiaD7KicFF8PMicbnlGwaMuZSDoLBlon3v94evdnXoUa5oBGa1icnrglIA8%2F640%3Fwx_fmt%3Dpng)

**第三步：进入控制台**  
注册完成后打开下方网址，点击右上角 控制台  
https://poixe.com/products/free

![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FJgLDtnLQIFeRZhebmdkWtv82HWMtj5O5LdzibcqkeJDibtUs991Zv7ekBwibm7eVrx923xaFLtBNoqIyyTbZ8ubT1s0GllMpYj9SZ1rGdDxN6k%2F640%3Fwx_fmt%3Dpng)

**第四步：查看令牌**  
进入控制台后，点击左侧侧边栏的 令牌

![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FJgLDtnLQIFdNc1X8HyaBibjU12ER6icTic3xe8hoXTQLJgbReTr26FtIz64iak1FLMzZQxj3rhlRbsGRGdcZV8rjt0PdFWvUj6M0M3vdKrMWbTI%2F640%3Fwx_fmt%3Dpng)

**第五步：复制信息**  
进入令牌页面即可看到 Key 和 URL，点击复制即可使用。

![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_png%2FJgLDtnLQIFfLlmRRlicFCveVPdkBtnYWC1oIqV82xfbUNWDqZ2ln8aO3xjAXkHSPHzB670U9lPibwhv88q8bEecQ3aJTJ5dbmiaiceoGiagThQw8%2F640%3Fwx_fmt%3Dpng)

注意事项

* cli2api 免费模型需通过对应的 messages / responses 协议 调用，不支持 completions 协议。
* cli2api 同时也是付费模型，调用免费版本请确保添加 :free 后缀。
* 免费额度按 rpm / rpd / tpm / tpd 四个维度限制，具体见容量规则。
* 请勿滥用，多账号注册、利用漏洞等违规行为将被清退。  
![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FJgLDtnLQIFe151jB4RzDjibziaIxV2ArSbj87tUHAmMibTNZ3M1AI4oJzPKPCARzhKqkiaVgvUJNAP9DheBE0HFDV7BrK6Y7E2X42FTSNN0Swh0%2F640%3Fwx_fmt%3Dpng)

文章对你有帮助，关注上面公众号支持下

在vscode配置，使用continue插件配模板，同时使用两个协议 ，替换APIkey即可

```
name: Local Configversion: 1.0.0schema: v1
```

```
models:  # 模型1：POIX1 Codex 5.3（代码专用，Responses协议，保持不变）  - name: "POIX1 Codex 5.3"    provider: "openai"    model: "cli2api/gpt-5.3-codex:free"    apiBase: "https://api.poixe.com/v1"    apiKey: "你的完整POIX1_API_KEY"    maxTokens: 4096    temperature: 0.3    useResponses: true    completionEndpoint: "/responses"    requestOptions:      headers:        Authorization: "Bearer 你的完整POIX1_API_KEY"
```

```
  # 模型2：POIX1 Claude 4.6（修复版，用Anthropic协议）  - name: "POIX1 Claude 4.6"    provider: "anthropic"    model: "cli2api/claude-sonnet-4-6:free"    apiBase: "https://api.poixe.com/v1"    apiKey: "你的完整POIX1_API_KEY"    maxTokens: 8192    temperature: 0.7    requestOptions:      headers:        Authorization: "Bearer 你的完整POIX1_API_KEY"        Anthropic-Version: "2023-06-01"
```

```
# 代码自动补全：用Codex 5.3（保持不变）tabAutocompleteModel:  name: "POIX1 Codex 5.3 Autocomplete"  provider: "openai"  model: "cli2api/gpt-5.3-codex:free"  apiBase: "https://api.poixe.com/v1"  apiKey: "你的完整POIX1_API_KEY"  maxTokens: 2048  temperature: 0.2  useResponses: true  completionEndpoint: "/responses"
```

`# 默认激活的模型` `activeModels:` `  - "POIX1 Codex 5.3"`

测试效果如下

![](https://wsrv.nl/?output=webp&url=https%3A%2F%2Fmmbiz.qpic.cn%2Fsz_mmbiz_png%2FJgLDtnLQIFfF3RwRxWv8DKu0icIESaIEbD8nhYyGfBRU7gUzB8Vib9wF3hQeU1YlTdKlgm6tmKhlqRBuiaN5GqWhwQlAa9D9sibNSR5nymEbkZY%2F640%3Fwx_fmt%3Dpng)