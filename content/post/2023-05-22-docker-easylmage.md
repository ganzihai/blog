---
title: PVE配置Docker之配置Easylmage图床
author: 杆子
type: post
date: 2023-05-22T12:34:38+00:00
url: /docker-easylmage.html
views:
  - 248
categories:
  - 网络
tags:
  - Docker
  - Easylmage
  - PVE

---
Docker安装过程可参考下面代码：  
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

安装好Docker后，我们新建文件夹用于部署easyimage：

<pre class="line-numbers"><code class="language-c" data-line="">
sudo -i

mkdir -p /root/data/docker_data/easyimage

cd /root/data/docker_data/easyimage
</code></pre>

创建docker-compose文件：

<pre class="line-numbers"><code class="language-c" data-line="">
vim docker-compose.yml
</code></pre>

在docker-compose.yml中添加Portainer安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
version: &#039;3.3&#039;
services:
  easyimage:
    image: ddsderek/easyimage:latest
    container_name: easyimage
    ports:
      - &#039;8088:80&#039;
    environment:
      - TZ=Asia/Shanghai
      - PUID=1000
      - PGID=1000
    volumes:
      - &#039;/root/data/docker_data/easyimage/config:/app/web/config&#039;
      - &#039;/root/data/docker_data/easyimage/i:/app/web/i&#039;
    restart: unless-stopped
</code></pre>

运行容器安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
cd /root/data/docker_data/easyimage    # 来到 dockercompose 文件所在的文件夹下

docker-compose up -d 
</code></pre>

到此Easylmage安装完成。