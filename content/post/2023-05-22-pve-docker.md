---
title: PVE最小化安装Ubuntu之docker安装
author: 杆子
type: post
date: 2023-05-22T01:10:15+00:00
url: /pve-docker.html
views:
  - 221
categories:
  - 网络
tags:
  - 4405U主机
  - Docker
  - PVE

---
Ubuntu安装好后，接下就是安装Docker了，  
>>>安装 Docker  
一键安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
wget -qO- get.docker.com | bash
</code></pre>

查看安装成功：

<pre class="line-numbers"><code class="language-c" data-line="">
docker -v  #查看 docker 版本
</code></pre>

设置开机启动：

<pre class="line-numbers"><code class="language-c" data-line="">
systemctl enable docker # 设置开机自动启动
</code></pre>

>>>安装 Docker-compose：  
安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
</code></pre>

设置权限：

<pre class="line-numbers"><code class="language-c" data-line="">
sudo chmod +x /usr/local/bin/docker-compose
</code></pre>

查看版本：

<pre class="line-numbers"><code class="language-c" data-line="">
docker-compose --version  #查看 docker-compose 版本
</code></pre>