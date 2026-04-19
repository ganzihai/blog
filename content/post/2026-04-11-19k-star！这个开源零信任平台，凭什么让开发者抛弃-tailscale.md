---
title: 19k Star！这个开源零信任平台，凭什么让开发者抛弃 Tailscale？
author: 杆子
type: post
date: 2026-04-11T01:27:32+00:00
url: /19k-star！这个开源零信任平台，凭什么让开发者抛弃-tailscale.html
views:
  - 2
categories:
  - 教程

---
<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_jpg/R4dg0ib2nglI7I3eEYqEbPSScYvyL7z1mmI9zUCI5icZTibrypPBD24VSlIJBejVn8C3w2upbJErmQOVz1P1u5Us4YzhZUvvtNQzY2hm0oJbWA/0?wx_fmt=jpeg" alt="cover_image" />

**原创 何三 何三**

大家好，我是何三，独立开发者。

> 19k Star，又一个 WireGuard 零信任项目火了！Pangolin 凭什么让开发者抛弃 Tailscale？

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/mmbiz_png/R4dg0ib2nglJ0qVR1X2rObQicOiaG1EoRlgViaiasIU5W4lEQhG66Rqg3Jq1CJFKOjyiaIsvnEqYicpnTVebmo0T4OChO4xVLdHoTiatiavf3n4L7a5g/640?from=appmsg" alt="pangolin_cover" /> 

远程访问内网这件事，说出来你可能不信——2026年了，大量团队还在用传统VPN、或者手动配 frp、ngrok 之类的穿透工具。

要么配置复杂到劝退，要么安全策略约等于没有。

Tailscale 确实火了一阵，Mesh 网络搞得挺优雅。但它有个硬伤：**服务端闭源，不能自托管**。你要么信任他们的控制面板，要么去折腾社区版的 Headscale——各种兼容性问题谁用谁知道。

所以当 Pangolin 以 **AGPLv3 全开源 + 完全可自托管** 的姿态杀进来的时候，GitHub 直接冲到了 **19k Star**，全球部署量号称超过 100 万。

今天就拆一下这个项目，看看它到底值不值得你花时间。

* * *

### Pangolin 是什么 {#pangolin}

一句话：**基于 WireGuard 的身份感知远程访问平台**，把反向代理和 VPN 合二为一。

它解决的核心问题是——让用户**安全地、有选择地**访问远程资源，而不是一股脑地把整个内网暴露出去。

传统VPN给你开了门，整个园区随便走。Pangolin 的思路是：我不给你园区通行证，我只给你 3 楼 302 室的钥匙。你去不了的房间，门都不让你看见。

这东西跟 Tailscale 的定位很像，但走了完全不同的技术路线。

* * *

### 架构原理：Hub-Spoke，不是 Mesh {#hubspokemesh}

Tailscale 用的是 Mesh 网状拓扑，每个设备都能直连其他设备。设备多了，管理 ACL 的复杂度是 N² 增长的。

Pangolin 选了 Hub-Spoke 模式：

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/mmbiz_png/R4dg0ib2nglIIHjYh0HpbqgECL3ibOPlutIhQnraG8Zun4J10iaLlPhe5DkSqD8uib27iazJb6xMh01tECHF5SibPTQlQH1u1z2vU2d2Bd8nia9ibv8/640?from=appmsg" alt="pangolin_01" /> 

**三个核心角色：**

  * **Server（控制面板）**：负责身份认证、密钥分发、资源编排、NAT穿透协调。不参与数据转发。
  * **Site（站点连接器）**：部署在你的各个网络里（办公室、云VPC、家里），只做出站连接，不需要公网 IP，不需要开端口。它就像一根延伸到内网的&#8221;触手&#8221;。
  * **Client（客户端）**：用户设备上装的客户端，登录后只能看到被授权的资源。

数据流是这样的：<code class="" data-line="">Client → Site → 目标资源</code>。Server 只帮忙协调，不碰数据。

NAT 穿透失败的时候，流量会通过 Server 中继，但对用户透明。

* * *

### 四个核心能力，拆开讲 {#}

#### 1. 浏览器直连：免装客户端访问 Web 应用 {#1web}

这是我觉得最实用的一个功能。

Pangolin 内置了一个**身份感知的反向代理**。你只需要在内网部署一个 Site，然后把某个 Web 应用注册为资源。用户打开浏览器、登录 Pangolin，就能直接访问——**不需要装任何客户端**。

可以配自定义域名，自动签 SSL 证书。还可以给不同资源加不同的认证策略：有的要 SSO，有的要邮箱白名单，有的加个 PIN 码。

对临时给外包、合作方开权限的场景，简直不要太方便。

#### 2. 私有资源访问：SSH、数据库、RDP 一网打尽 {#2sshrdp}

SSH 服务器、MySQL、PostgreSQL、Windows 远程桌面……这些不是 HTTP 的东西，通过 Pangolin Client 的 WireGuard 隧道直接打通。

每个资源可以有 DNS 别名。比如你内网有一台 MySQL 跑在 <code class="" data-line="">192.168.1.210</code>，Pangolin 里给它起个别名 <code class="" data-line="">db-prod.my-org.internal</code>，连上就能用。

多个站点的资源可以同时在线，不同子网之间也不会冲突。

#### 3. 零信任访问控制 {#3}

Pangolin 的权限模型是**资源导向**的，不是网络导向的。

你说：&#8221;运维组的张三可以访问 prod-db，开发组的李四只能访问 staging-api&#8221;。就这么简单。

支持角色、组、设备安全策略（操作系统版本、磁盘加密之类的 posture check）。还支持 OIDC SSO，接 Google Workspace、Okta、Authentik 之类的都行。

默认 deny all。你不主动开权限的，什么都访问不了。

#### 4. 完全可自托管 {#4}

这是跟 Tailscale 最大的区别。

Pangolin Server + 所有客户端，**AGPLv3 全开源**。你可以跑在自己的 VPS、家庭服务器、企业机房里，数据完全不出你的掌控。

不想自己运维，也可以用他们的 Cloud 版，免费额度相当慷慨。

* * *

### 跟 Tailscale 到底怎么选 {#tailscale}

<img decoding="async" src="https://wsrv.nl/?output=webp&#038;url=https://mmbiz.qpic.cn/sz_mmbiz_png/R4dg0ib2nglKzibsyC20Q5Ec5Tic0Ds0SEjoNIZibsdaNzsNCsaJbuR3dzxy6czKC6jtAsPweEJQWXhvKlDOH1s8N8uqBF1Hk0mlnUmCBvYia4d0/640?from=appmsg" alt="pangolin_02" /> 

我直接说结论：

  * 你需要的是**设备之间互相通信**（比如手机直连家里 NAS、服务器互传数据）→ Tailscale 更顺手。
  * 你需要的是**按身份、按资源地精细管控远程访问**，或者你**必须自托管** → Pangolin 更合适。
  * 你有大量 Web 应用需要**给不同人开不同权限的浏览器访问** → Pangolin 基本没有对手。

别被&#8221;替代 Tailscale&#8221;这种说法带节奏了。它们解决的是不同层面的需求。很多团队其实两个都在用。

* * *

### 快速上手 {#-1}

Pangolin 提供了 Docker 部署方式，几行命令就能跑起来：

<pre><code class="" data-line=""># 拉取镜像
docker pull fosrl/pangolin

# 启动服务（简化版示例）
docker run -d \
  --name pangolin \
  --restart always \
  -p 443:443 \
  -p 3478:3478/udp \
  -v pangolin-data:/var/lib/pangolin \
  fosrl/pangolin
</code></pre>

启动后访问 <code class="" data-line="">https://你的域名</code>，跟着 Web 引导完成初始化就行。详细步骤看官方文档。

客户端支持 macOS、Windows、Linux、iOS、Android 全平台，在 pangolin.net/downloads 下载。

* * *

### 一句话总结 {#-2}

Pangolin 不完美，但它确实把**零信任远程访问**这个方向做对了——身份驱动的资源访问、反向代理 + VPN 一体、全栈开源可自托管。

如果你是个独立开发者或者小团队，内网有几个服务需要安全地暴露给特定的人，Pangolin 值得一试。比折腾 frp 配置文件体面多了。

* * *

_本文使用 MGO 编辑并发布_

> 关注&#8221;何三笔记&#8221;，回复&#8221;mgo&#8221; 免费下载使用