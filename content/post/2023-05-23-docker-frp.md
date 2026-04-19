---
title: PVE配置Docker之配置FRP
author: 杆子
type: post
date: 2023-05-23T02:38:19+00:00
url: /docker-frp.html
views:
  - 220
categories:
  - 网络
tags:
  - Docker
  - FRP
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

安装好Docker后，我们新建文件夹用于部署FRP：

<pre class="line-numbers"><code class="language-c" data-line="">
sudo -i

mkdir -p /root/data/docker_data/frpc

cd /root/data/docker_data/frpc
</code></pre>

创建docker-compose文件：

<pre class="line-numbers"><code class="language-c" data-line="">
vim docker-compose.yml
</code></pre>

在docker-compose.yml中添加Portainer安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
version: &#039;3&#039;
services:
    frpc:
        restart: always
        network_mode: host
        volumes:
            - &#039;./frpc.ini:/etc/frp/frpc.ini&#039;
        container_name: frpc
        image: snowdreamtech/frpc
</code></pre>

运行容器安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
cd /root/data/docker_data/frpc    # 来到 dockercompose 文件所在的文件夹下

docker-compose up -d 
</code></pre>

到此FRPC安装完成。