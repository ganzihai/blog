---
title: PVE配置Docker之搭建WordPress网站
author: 杆子
type: post
date: 2023-05-22T04:31:10+00:00
url: /docker-wordpress.html
views:
  - 224
categories:
  - 网络
tags:
  - Docker
  - PVE
  - WordPress

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

安装好Docker后，我们新建文件夹用于部署WordPress：

<pre class="line-numbers"><code class="language-c" data-line="">
sudo -i

mkdir -p /root/data/docker_data/WordPress

cd /root/data/docker_data/WordPress
</code></pre>

创建docker-compose文件：

<pre class="line-numbers"><code class="language-c" data-line="">
vim docker-compose.yml
</code></pre>

在docker-compose.yml中添加WordPress安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
version: &#039;3.1&#039;
services:
  db:
    image: mysql:5.7
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: XXXX
      MYSQL_DATABASE: XXXX
      MYSQL_USER: XXXX
      MYSQL_PASSWORD: 884GErenwu
    volumes:
      - /root/data/docker_data/wordpress/db:/var/lib/mysql

  wordpress:
    image: wordpress:latest
    depends_on:
      - db
    network_mode: host
    restart: always
    environment:
      WORDPRESS_DB_HOST: XXXX
      WORDPRESS_DB_USER: XXXX
      WORDPRESS_DB_PASSWORD: XXXX
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - /root/data/docker_data/wordpress/data:/var/www/html

volumes:
  db_data:
  wordpress_data:

</code></pre>

运行容器安装命令：

<pre class="line-numbers"><code class="language-c" data-line="">
cd /root/data/docker_data/WordPress    # 来到 dockercompose 文件所在的文件夹下

docker-compose up -d 
</code></pre>

到此WordPress安装完成。