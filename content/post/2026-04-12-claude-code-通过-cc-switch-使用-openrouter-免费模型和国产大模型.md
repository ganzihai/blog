---
title: Claude Code 通过 CC Switch 使用 OpenRouter 免费模型和国产大模型
author: 杆子
type: post
date: 2026-04-12T01:43:51+00:00
url: /claude-code-通过-cc-switch-使用-openrouter-免费模型和国产大模型.html
views:
  - 4
categories:
  - 教程

---
<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_jpg/uP9BAA9ItAEbe3iaB0oy1q8PFzaj6wDMCPibvdSX2PWNeBCNic5fjz2qTAlRcWjibBEbdADBOAnvCq1nXrxgib11UX6lClvFw2qcandJpEBJDmwk/0?wx_fmt=jpeg" alt="cover_image" />

#### 效果展示 {#}

通过 CC Switch，我们可以成功接入包括 <code class="" data-line="">qwen/qwen3.6-plus:free</code> 在内的多种免费大模型。以下是实际运行效果截图：

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/mmbiz_png/uP9BAA9ItAHGjYabJr2Ns1rAia9Kuw6ibeF2Yu0RXib0XtwHGuiaI2Zia67IoawmaaG7tKBetpvevuuTQMWtq2XE0U6EyrP4p9FXepKb6dZoglmk/640?wx_fmt=png&#038;from=appmsg" alt="mnjogoas.png" title="mnjogoas.png" /> 

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/uP9BAA9ItAFibex56s6dkeibB6VKJWXvtpWAmXfFHPHLyia7O8Dia5HLWnD3IfDB6HDllovdDh3vrR5Uht1RxhLheJtTu7ELfYUBY4BAWB1pZ9s/640?wx_fmt=png&#038;from=appmsg" alt="mnjogtpe.png" title="mnjogtpe.png" /> 

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/uP9BAA9ItAFTGpe6icyDUbGd3GTicoKQ2wAoNoxAqIzuYu2wyt4piajPjiaIJVqzP7ibSx2mpSGwdHEZ4LNV7jicW2HgOpicmjmKJH18v4rR0qiaw8I/640?wx_fmt=png&#038;from=appmsg" alt="mnjowuy8.png" title="mnjowuy8.png" /> 

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/mmbiz_png/uP9BAA9ItAGW8mIyEt5wMETduCIzIqfMdUiaM7LZyTic4icEViacYEUMDT6Tia6C6Tlfpj1hQlBiafp65aSdyoHoKHMBWpuWMgYPc7zAz7KXpskuI/640?wx_fmt=png&#038;from=appmsg" alt="mnjoj0m5.png" title="mnjoj0m5.png" /> 

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/uP9BAA9ItAGZPtM4U1TfdiblY1aCjxUDCa1SdwFhMNual3CxIYibqSIH16njt6PeLWIIUYZhDCV5uzsyCmjiahIHuU44X60GDRgQgekmAEwoGk/640?wx_fmt=png&#038;from=appmsg" alt="mnjp50e0.png" title="mnjp50e0.png" /> 

#### 安装 Claude Code {#claudecode}

在 Windows PowerShell 中执行以下命令进行安装：

<pre><code class="" data-line="">curl -fsSL https://claude.ai/install.sh |bash
</code></pre>

#### 安装 CC Switch {#ccswitch}

**项目地址：**  
https://github.com/farion1231/cc-switch

**下载软件：**  
https://github.com/farion1231/cc-switch/releases/tag/v3.12.3

下载并安装 <code class="" data-line="">CC-Switch-v3.12.3-Windows.msi</code> 文件即可。

#### 配置 CC Switch {#ccswitch-1}

##### 1. 添加模型 {#1}

点击添加模型，界面如下：

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/uP9BAA9ItAGRBhewjibGCSemricT1hEDLickKfSbYKvmfGvLibz5GQG8z0NeqYKNVjibOtVtvwf3scliayd94icibOAdF8027J5AQcMSGlB7wTbrauQ/640?wx_fmt=png&#038;from=appmsg" alt="mnjopzy3.png" title="mnjopzy3.png" /> 

例如，你可以添加 **Longcat** 的 <code class="" data-line="">LongCat-Flash-Lite</code>，该模型每天提供 **5000万免费 Token**。

此外，**OpenRouter** 也有丰富的免费模型可供选择：  
https://openrouter.ai/models?fmt=cards&q=free

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/mmbiz_png/uP9BAA9ItAHOTmnMvxiaOLsKvFatY4iaaakZmKYQtdticbhZPzUK38ALoe3iaCYoPt1iapvNFjAboPVtO43fqQ8BcVXUD9F5bs1ggR1yA0fiazYlc/640?wx_fmt=png&#038;from=appmsg" alt="mnjoqcr0.png" title="mnjoqcr0.png" /> 

##### 2. 填写 API Key {#2apikey}

在配置界面填入你的 API Key：

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/uP9BAA9ItAGXjEzib3XibiakdaAN1xLaNC3nzAj518oS4D6NdsYWDuu3G4HFBbn1Labry4P4n5qQrEL8DM7TEd1EnRRYu6nvP8GuV5Otprp9Z4/640?wx_fmt=png&#038;from=appmsg" alt="mnjorktl.png" title="mnjorktl.png" /> 

##### 3. 填写模型名称 {#3}

准确填写你要使用的模型名称：

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/mmbiz_png/uP9BAA9ItAExkqPKswGMY2jgRybRnHkslCPGuGiaIKdOF2vE1xibRAXSKvqT8b5xsEZWuHzPX3SYpzZ0egE4oBsXNFF1hqC1VFXBia4XfvCU5o/640?wx_fmt=png&#038;from=appmsg" alt="mnjotpan.png" title="mnjotpan.png" /> 

填写完毕后，点击**保存**即可。

#### 启动 Claude Code {#claudecode-1}

启动 Claude Code 后，如需进行中文交流，可以直接发送指令：

> 使用中文和我交流

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/uP9BAA9ItAH6HEVZFic3nGrTyvuqpLyOq02EF1wPx7bNicricXQKWLxYhON2jOqGbPQsCiacQR6MljmewrNyJvm8TNsnHL5IhWaoQI5ic7efsTIU/640?wx_fmt=png&#038;from=appmsg" alt="mnjoun91.png" title="mnjoun91.png" /> 

#### 小结 {#-1}

配置完成后，你就可以开始愉快地免费使用 Claude Code 配合各种大模型进行开发了。快去试试吧！