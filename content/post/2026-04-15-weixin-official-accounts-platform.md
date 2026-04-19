---
title: 微信公众号文章一键同步到 WordPress 完整方案
author: 杆子
type: post
date: 2026-04-15T14:12:35+00:00
url: /weixin-official-accounts-platform.html
views:
  - 6
categories:
  - 教程

---
> <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
>   <strong>适用场景</strong>：在手机微信浏览公众号时，遇到感兴趣的文章，通过一键触发 Webhook，自动将文章内容发布到自己的 WordPress 站点，方便存档与二次阅读。
> </p>

<hr class="bg-quiet h-px border-0" />

## 一、整体架构概览 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  整个系统由以下几个环节串联：
</p>

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          text
        </div>
      </div>
      
      <div>
        <code class="" data-line="">[手机微信] → 发现感兴趣文章&lt;br />
↓ 复制链接 / 一键分享&lt;br />
[iOS 快捷指令 / HTTP Shortcuts]&lt;br />
↓ POST 请求（附带文章 URL）&lt;br />
[HuggingFace Spaces - Flask Webhook 服务]&lt;br />
↓ 调用 wechat-article-exporter API 获取文章 HTML&lt;br />
↓ 替换图片地址（wsrv.nl 代理，解决防盗链）&lt;br />
[WordPress REST API]&lt;br />
↓ 创建草稿文章&lt;br />
[WordPress 后台] → 检查后发布&lt;br />
</code>
      </div>
    </div>
  </div>
</div>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>核心技术选型</strong>：
</p>

<div class="group relative my-[1em]">
  <div class="sticky top-0 z-10 h-0" aria-hidden="true">
    <div class="w-full overflow-hidden bg-raised border-x md:max-w-[90vw] border-subtlest ring-subtlest divide-subtlest">
    </div>
  </div>
  
  <div class="w-full overflow-auto scrollbar-subtle rounded-lg border md:max-w-[90vw] border-subtlest ring-subtlest divide-subtlest bg-raised">
    <table class="[&_tr:last-child_td]:border-b-0 my-0 w-full table-auto border-separate border-spacing-0 text-sm font-sans rounded-lg [&_tr:last-child_td:first-child]:rounded-bl-lg [&_tr:last-child_td:last-child]:rounded-br-lg">
      <tr>
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          环节
        </th>
        
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          技术方案
        </th>
        
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          理由
        </th>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          文章内容获取
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          wechat-article-exporter 公开 API
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          无需维护爬虫，稳定，支持 html/markdown/text
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          图片防盗链
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          wsrv.nl 代理前缀
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          免费 CDN，自动转 WebP，无需下载上传
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          Webhook 服务
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          HuggingFace Spaces（Docker 模式）
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          免费，公开 HTTPS URL，Python 全功能支持
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          CI/CD
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          GitHub → Docker Hub → HF Space 自动同步
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          预构建镜像加速 HF 启动，代码集中管理
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          触发方式
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          iOS 快捷指令（Shortcuts）
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          微信内分享即触发，2 秒完成
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          WordPress 发布
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          REST API + Application Password
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          原生支持，无需插件
        </td>
      </tr>
    </table>
  </div>
</div>

<hr class="bg-quiet h-px border-0" />

## 二、前置准备 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

## 2.1 WordPress 开启 REST API 应用密码 {#21-wordpress--rest-api.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<ol class="marker:text-quiet list-decimal">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      登录 WordPress 后台，进入 <strong>用户 → 个人资料</strong>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      下滑找到 <strong>应用密码</strong> 区块
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      填写一个名称（如 <code class="" data-line="">wxpush</code>），点击 <strong>添加新应用密码</strong>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      复制生成的密码（格式类似 <code class="" data-line="">xxxx xxxx xxxx xxxx xxxx xxxx</code>），<strong>只显示一次</strong>，请妥善保存
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      确认站点已开启固定链接（设置 → 固定链接），REST API 才能正常工作
    </p>
  </li>
</ol>

> <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
>   注意：应用密码中的空格保留即可，Python <code class="" data-line="">requests</code> 的 <code class="" data-line="">HTTPBasicAuth</code> 会自动处理。
> </p>

## 2.2 注册所需账号 {#22.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<ul class="marker:text-quiet list-disc">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      <a class="reset interactable cursor-pointer decoration-1 underline-offset-1 text-super hover:underline font-semibold" href="https://huggingface.co/" target="_blank" rel="nofollow noopener"><span class="text-box-trim-both">HuggingFace</span></a> 账号（用于部署 Spaces）
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      <a class="reset interactable cursor-pointer decoration-1 underline-offset-1 text-super hover:underline font-semibold" href="https://hub.docker.com/" target="_blank" rel="nofollow noopener"><span class="text-box-trim-both">Docker Hub</span></a> 账号（用于存储预构建镜像）
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      <a class="reset interactable cursor-pointer decoration-1 underline-offset-1 text-super hover:underline font-semibold" href="https://github.com/" target="_blank" rel="nofollow noopener"><span class="text-box-trim-both">GitHub</span></a> 账号（代码仓库 + CI/CD）
    </p>
  </li>
</ul>

<hr class="bg-quiet h-px border-0" />

## 三、项目代码结构 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  在 GitHub 新建一个仓库，目录结构如下：
</p>

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          text
        </div>
      </div>
      
      <div>
        <code class="" data-line="">wxpush/&lt;br />
├── app.py                # Flask Webhook 主程序&lt;br />
├── requirements.txt      # Python 依赖&lt;br />
├── Dockerfile            # Docker 镜像定义&lt;br />
└── .github/&lt;br />
└── workflows/&lt;br />
└── deploy.yml    # GitHub Actions CI/CD 配置&lt;br />
</code>
      </div>
    </div>
  </div>
</div>

<hr class="bg-quiet h-px border-0" />

## 四、核心代码实现 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

## 4.1 主程序 <code class="" data-line="">app.py</code> {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          python
        </div>
      </div>
      
      <div>
        <code class="" data-line="">&lt;code&gt;&lt;span class="token token"&gt;import&lt;/span&gt; os&lt;br />
&lt;span class="token token"&gt;import&lt;/span&gt; re&lt;br />
&lt;span class="token token"&gt;import&lt;/span&gt; requests&lt;br />
&lt;span class="token token"&gt;from&lt;/span&gt; flask &lt;span class="token token"&gt;import&lt;/span&gt; Flask&lt;span class="token token punctuation"&gt;,&lt;/span&gt; request&lt;span class="token token punctuation"&gt;,&lt;/span&gt; jsonify&lt;br />
&lt;span class="token token"&gt;from&lt;/span&gt; requests&lt;span class="token token punctuation"&gt;.&lt;/span&gt;auth &lt;span class="token token"&gt;import&lt;/span&gt; HTTPBasicAuth</code></code>app <span class="token token operator">=</span> Flask<span class="token token punctuation">(</span>__name__<span class="token token punctuation">)</span></p> 
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token"># 从环境变量读取配置（不要硬编码在代码里）</span><br /> WEBHOOK_SECRET <span class="token token operator">=</span> os<span class="token token punctuation">.</span>environ<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;WEBHOOK_SECRET&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;change-me&#8221;</span><span class="token token punctuation">)</span><br /> WP_URL <span class="token token operator">=</span> os<span class="token token punctuation">.</span>environ<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;WP_URL&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;https://your-wordpress.com&#8221;</span><span class="token token punctuation">)</span><br /> WP_USER <span class="token token operator">=</span> os<span class="token token punctuation">.</span>environ<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;WP_USER&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;admin&#8221;</span><span class="token token punctuation">)</span><br /> WP_PASS <span class="token token operator">=</span> os<span class="token token punctuation">.</span>environ<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;WP_PASS&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;&#8221;</span><span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code>EXPORTER_API <span class="token token operator">=</span> <span class="token token">&#8220;https://wechat-article-exporter-lyart.vercel.app/api/public/v1/download&#8221;</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token">def</span> <span class="token token">fetch_article</span><span class="token token punctuation">(</span>wx_url<span class="token token punctuation">:</span> <span class="token token">str</span><span class="token token punctuation">)</span> <span class="token token operator">&#8211;</span><span class="token token operator">></span> <span class="token token">dict</span><span class="token token punctuation">:</span><br /> <span class="token token triple-quoted-string">&#8220;&#8221;&#8221;<br /> </span><span class="token token triple-quoted-string"> 通过 wechat-article-exporter 公开 API 获取文章内容。<br /> </span><span class="token token triple-quoted-string"> 主路径：调用第三方 API（无需 API Key）。<br /> </span><span class="token token triple-quoted-string"> 备用路径：直接 requests 抓取微信页面。<br /> </span><span class="token token triple-quoted-string"> &#8220;&#8221;&#8221;</span><br /> <span class="token token">try</span><span class="token token punctuation">:</span><br /> resp <span class="token token operator">=</span> requests<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><br /> EXPORTER_API<span class="token token punctuation">,</span><br /> params<span class="token token operator">=</span><span class="token token punctuation">{</span><span class="token token">&#8220;url&#8221;</span><span class="token token punctuation">:</span> wx_url<span class="token token punctuation">,</span> <span class="token token">&#8220;format&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;html&#8221;</span><span class="token token punctuation">}</span><span class="token token punctuation">,</span><br /> timeout<span class="token token operator">=</span><span class="token token">30</span><br /> <span class="token token punctuation">)</span><br /> resp<span class="token token punctuation">.</span>raise_for_status<span class="token token punctuation">(</span><span class="token token punctuation">)</span><br /> data <span class="token token operator">=</span> resp<span class="token token punctuation">.</span>json<span class="token token punctuation">(</span><span class="token token punctuation">)</span><br /> <span class="token token">return</span> <span class="token token punctuation">{</span><br /> <span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">:</span> data<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;无标题&#8221;</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><br /> <span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">:</span> data<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;&#8221;</span><span class="token token punctuation">)</span><br /> <span class="token token punctuation">}</span><br /> <span class="token token">except</span> Exception <span class="token token">as</span> e<span class="token token punctuation">:</span><br /> <span class="token token"># Fallback：直接抓取微信页面</span><br /> <span class="token token">return</span> fetch_article_fallback<span class="token token punctuation">(</span>wx_url<span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token">def</span> <span class="token token">fetch_article_fallback</span><span class="token token punctuation">(</span>wx_url<span class="token token punctuation">:</span> <span class="token token">str</span><span class="token token punctuation">)</span> <span class="token token operator">&#8211;</span><span class="token token operator">></span> <span class="token token">dict</span><span class="token token punctuation">:</span><br /> <span class="token token triple-quoted-string">&#8220;&#8221;&#8221;备用抓取方式：直接解析微信文章页面 HTML&#8221;&#8221;&#8221;</span><br /> <span class="token token">from</span> bs4 <span class="token token">import</span> BeautifulSoup<br /> headers <span class="token token operator">=</span> <span class="token token punctuation">{</span><br /> <span class="token token">&#8220;User-Agent&#8221;</span><span class="token token punctuation">:</span> <span class="token token punctuation">(</span><br /> <span class="token token">&#8220;Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) &#8220;</span><br /> <span class="token token">&#8220;AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148&#8221;</span><br /> <span class="token token punctuation">)</span><br /> <span class="token token punctuation">}</span><br /> resp <span class="token token operator">=</span> requests<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span>wx_url<span class="token token punctuation">,</span> headers<span class="token token operator">=</span>headers<span class="token token punctuation">,</span> timeout<span class="token token operator">=</span><span class="token token">20</span><span class="token token punctuation">)</span><br /> soup <span class="token token operator">=</span> BeautifulSoup<span class="token token punctuation">(</span>resp<span class="token token punctuation">.</span>text<span class="token token punctuation">,</span> <span class="token token">&#8220;html.parser&#8221;</span><span class="token token punctuation">)</span><br /> title_tag <span class="token token operator">=</span> soup<span class="token token punctuation">.</span>find<span class="token token punctuation">(</span><span class="token token">&#8220;h1&#8221;</span><span class="token token punctuation">,</span> <span class="token token">id</span><span class="token token operator">=</span><span class="token token">&#8220;activity-name&#8221;</span><span class="token token punctuation">)</span><br /> content_tag <span class="token token operator">=</span> soup<span class="token token punctuation">.</span>find<span class="token token punctuation">(</span><span class="token token">&#8220;div&#8221;</span><span class="token token punctuation">,</span> <span class="token token">id</span><span class="token token operator">=</span><span class="token token">&#8220;js_content&#8221;</span><span class="token token punctuation">)</span><br /> <span class="token token">return</span> <span class="token token punctuation">{</span><br /> <span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">:</span> title_tag<span class="token token punctuation">.</span>get_text<span class="token token punctuation">(</span>strip<span class="token token operator">=</span><span class="token token boolean">True</span><span class="token token punctuation">)</span> <span class="token token">if</span> title_tag <span class="token token">else</span> <span class="token token">&#8220;无标题&#8221;</span><span class="token token punctuation">,</span><br /> <span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">:</span> <span class="token token">str</span><span class="token token punctuation">(</span>content_tag<span class="token token punctuation">)</span> <span class="token token">if</span> content_tag <span class="token token">else</span> <span class="token token">&#8220;&#8221;</span><br /> <span class="token token punctuation">}</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token">def</span> <span class="token token">fix_images</span><span class="token token punctuation">(</span>html<span class="token token punctuation">:</span> <span class="token token">str</span><span class="token token punctuation">)</span> <span class="token token operator">&#8211;</span><span class="token token operator">></span> <span class="token token">str</span><span class="token token punctuation">:</span><br /> <span class="token token triple-quoted-string">&#8220;&#8221;&#8221;<br /> </span><span class="token token triple-quoted-string"> 将微信图片 CDN 地址替换为 wsrv.nl 代理地址，<br /> </span><span class="token token triple-quoted-string"> 解决防盗链问题，同时自动转换为 WebP 格式。<br /> </span><span class="token token triple-quoted-string"> &#8220;&#8221;&#8221;</span><br /> <span class="token token">def</span> <span class="token token">replace_src</span><span class="token token punctuation">(</span><span class="token token">match</span><span class="token token punctuation">)</span><span class="token token punctuation">:</span><br /> original_url <span class="token token operator">=</span> <span class="token token">match</span><span class="token token punctuation">.</span>group<span class="token token punctuation">(</span><span class="token token">1</span><span class="token token punctuation">)</span><br /> proxied <span class="token token operator">=</span> <span class="token token string-interpolation">f&#8221;https://wsrv.nl/?output=webp&url=</span><span class="token token string-interpolation interpolation punctuation">{</span><span class="token token string-interpolation interpolation">original_url</span><span class="token token string-interpolation interpolation punctuation">}</span><span class="token token string-interpolation">&#8220;</span><br /> <span class="token token">return</span> <span class="token token string-interpolation">f&#8217;src=&#8221;</span><span class="token token string-interpolation interpolation punctuation">{</span><span class="token token string-interpolation interpolation">proxied</span><span class="token token string-interpolation interpolation punctuation">}</span><span class="token token string-interpolation">&#8220;&#8216;</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token"># 匹配微信图片 CDN 域名</span><br /> html <span class="token token operator">=</span> re<span class="token token punctuation">.</span>sub<span class="token token punctuation">(</span><br /> <span class="token token">r&#8217;src=&#8221;(https://mmbiz\.qpic\.cn[^&#8221;]*)&#8221;&#8216;</span><span class="token token punctuation">,</span><br /> replace_src<span class="token token punctuation">,</span><br /> html<br /> <span class="token token punctuation">)</span><br /> <span class="token token"># 同时处理 data-src（微信懒加载图片）</span><br /> html <span class="token token operator">=</span> re<span class="token token punctuation">.</span>sub<span class="token token punctuation">(</span><br /> <span class="token token">r&#8217;data-src=&#8221;(https://mmbiz\.qpic\.cn[^&#8221;]*)&#8221;&#8216;</span><span class="token token punctuation">,</span><br /> <span class="token token">lambda</span> m<span class="token token punctuation">:</span> <span class="token token string-interpolation">f&#8217;src=&#8221;https://wsrv.nl/?output=webp&url=</span><span class="token token string-interpolation interpolation punctuation">{</span><span class="token token string-interpolation interpolation">m</span><span class="token token string-interpolation interpolation punctuation">.</span><span class="token token string-interpolation interpolation">group</span><span class="token token string-interpolation interpolation punctuation">(</span><span class="token token string-interpolation interpolation">1</span><span class="token token string-interpolation interpolation punctuation">)</span><span class="token token string-interpolation interpolation punctuation">}</span><span class="token token string-interpolation">&#8220;&#8216;</span><span class="token token punctuation">,</span><br /> html<br /> <span class="token token punctuation">)</span><br /> <span class="token token">return</span> html
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token">def</span> <span class="token token">post_to_wordpress</span><span class="token token punctuation">(</span>title<span class="token token punctuation">:</span> <span class="token token">str</span><span class="token token punctuation">,</span> content<span class="token token punctuation">:</span> <span class="token token">str</span><span class="token token punctuation">)</span> <span class="token token operator">&#8211;</span><span class="token token operator">></span> <span class="token token">dict</span><span class="token token punctuation">:</span><br /> <span class="token token triple-quoted-string">&#8220;&#8221;&#8221;通过 WordPress REST API 创建草稿文章&#8221;&#8221;&#8221;</span><br /> endpoint <span class="token token operator">=</span> <span class="token token string-interpolation">f&#8221;</span><span class="token token string-interpolation interpolation punctuation">{</span><span class="token token string-interpolation interpolation">WP_URL</span><span class="token token string-interpolation interpolation punctuation">.</span><span class="token token string-interpolation interpolation">rstrip</span><span class="token token string-interpolation interpolation punctuation">(</span><span class="token token string-interpolation interpolation">&#8216;/&#8217;</span><span class="token token string-interpolation interpolation punctuation">)</span><span class="token token string-interpolation interpolation punctuation">}</span><span class="token token string-interpolation">/wp-json/wp/v2/posts&#8221;</span><br /> payload <span class="token token operator">=</span> <span class="token token punctuation">{</span><br /> <span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">:</span> title<span class="token token punctuation">,</span><br /> <span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">:</span> content<span class="token token punctuation">,</span><br /> <span class="token token">&#8220;status&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;draft&#8221;</span> <span class="token token"># 先存草稿，确认内容后手动发布</span><br /> <span class="token token punctuation">}</span><br /> resp <span class="token token operator">=</span> requests<span class="token token punctuation">.</span>post<span class="token token punctuation">(</span><br /> endpoint<span class="token token punctuation">,</span><br /> json<span class="token token operator">=</span>payload<span class="token token punctuation">,</span><br /> auth<span class="token token operator">=</span>HTTPBasicAuth<span class="token token punctuation">(</span>WP_USER<span class="token token punctuation">,</span> WP_PASS<span class="token token punctuation">)</span><span class="token token punctuation">,</span><br /> timeout<span class="token token operator">=</span><span class="token token">20</span><br /> <span class="token token punctuation">)</span><br /> resp<span class="token token punctuation">.</span>raise_for_status<span class="token token punctuation">(</span><span class="token token punctuation">)</span><br /> <span class="token token">return</span> resp<span class="token token punctuation">.</span>json<span class="token token punctuation">(</span><span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token decorator annotation punctuation">@app</span><span class="token token decorator annotation punctuation">.</span><span class="token token decorator annotation punctuation">route</span><span class="token token punctuation">(</span><span class="token token">&#8220;/health&#8221;</span><span class="token token punctuation">,</span> methods<span class="token token operator">=</span><span class="token token punctuation">[</span><span class="token token">&#8220;GET&#8221;</span><span class="token token punctuation">]</span><span class="token token punctuation">)</span><br /> <span class="token token">def</span> <span class="token token">health</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">:</span><br /> <span class="token token triple-quoted-string">&#8220;&#8221;&#8221;健康检查接口，用于确认服务是否运行&#8221;&#8221;&#8221;</span><br /> <span class="token token">return</span> jsonify<span class="token token punctuation">(</span><span class="token token punctuation">{</span><span class="token token">&#8220;status&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;ok&#8221;</span><span class="token token punctuation">}</span><span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token decorator annotation punctuation">@app</span><span class="token token decorator annotation punctuation">.</span><span class="token token decorator annotation punctuation">route</span><span class="token token punctuation">(</span><span class="token token">&#8220;/push&#8221;</span><span class="token token punctuation">,</span> methods<span class="token token operator">=</span><span class="token token punctuation">[</span><span class="token token">&#8220;POST&#8221;</span><span class="token token punctuation">]</span><span class="token token punctuation">)</span><br /> <span class="token token">def</span> <span class="token token">push</span><span class="token token punctuation">(</span><span class="token token punctuation">)</span><span class="token token punctuation">:</span><br /> <span class="token token triple-quoted-string">&#8220;&#8221;&#8221;<br /> </span><span class="token token triple-quoted-string"> Webhook 主入口。<br /> </span><span class="token token triple-quoted-string"> 请求体（JSON）：<br /> </span><span class="token token triple-quoted-string"> {<br /> </span><span class="token token triple-quoted-string"> &#8220;secret&#8221;: &#8220;你的密钥&#8221;,<br /> </span><span class="token token triple-quoted-string"> &#8220;url&#8221;: &#8220;https://mp.weixin.qq.com/s/xxxxxx&#8221;<br /> </span><span class="token token triple-quoted-string"> }<br /> </span><span class="token token triple-quoted-string"> &#8220;&#8221;&#8221;</span><br /> data <span class="token token operator">=</span> request<span class="token token punctuation">.</span>get_json<span class="token token punctuation">(</span>silent<span class="token token operator">=</span><span class="token token boolean">True</span><span class="token token punctuation">)</span><br /> <span class="token token">if</span> <span class="token token">not</span> data<span class="token token punctuation">:</span><br /> <span class="token token">return</span> jsonify<span class="token token punctuation">(</span><span class="token token punctuation">{</span><span class="token token">&#8220;error&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;invalid json&#8221;</span><span class="token token punctuation">}</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span> <span class="token token">400</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token"># 验证密钥，防止他人滥用接口</span><br /> <span class="token token">if</span> data<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;secret&#8221;</span><span class="token token punctuation">)</span> <span class="token token operator">!=</span> WEBHOOK_SECRET<span class="token token punctuation">:</span><br /> <span class="token token">return</span> jsonify<span class="token token punctuation">(</span><span class="token token punctuation">{</span><span class="token token">&#8220;error&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;unauthorized&#8221;</span><span class="token token punctuation">}</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span> <span class="token token">401</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code>wx_url <span class="token token operator">=</span> data<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;url&#8221;</span><span class="token token punctuation">,</span> <span class="token token">&#8220;&#8221;</span><span class="token token punctuation">)</span><span class="token token punctuation">.</span>strip<span class="token token punctuation">(</span><span class="token token punctuation">)</span><br /> <span class="token token">if</span> <span class="token token">not</span> wx_url<span class="token token punctuation">:</span><br /> <span class="token token">return</span> jsonify<span class="token token punctuation">(</span><span class="token token punctuation">{</span><span class="token token">&#8220;error&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;missing url&#8221;</span><span class="token token punctuation">}</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span> <span class="token token">400</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token"># 1. 获取文章内容</span><br /> article <span class="token token operator">=</span> fetch_article<span class="token token punctuation">(</span>wx_url<span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token"># 2. 处理图片防盗链</span><br /> article<span class="token token punctuation">[</span><span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">]</span> <span class="token token operator">=</span> fix_images<span class="token token punctuation">(</span>article<span class="token token punctuation">[</span><span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">]</span><span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token"># 3. 发布到 WordPress</span><br /> result <span class="token token operator">=</span> post_to_wordpress<span class="token token punctuation">(</span>article<span class="token token punctuation">[</span><span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">]</span><span class="token token punctuation">,</span> article<span class="token token punctuation">[</span><span class="token token">&#8220;content&#8221;</span><span class="token token punctuation">]</span><span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token">return</span> jsonify<span class="token token punctuation">(</span><span class="token token punctuation">{</span><br /> <span class="token token">&#8220;status&#8221;</span><span class="token token punctuation">:</span> <span class="token token">&#8220;ok&#8221;</span><span class="token token punctuation">,</span><br /> <span class="token token">&#8220;post_id&#8221;</span><span class="token token punctuation">:</span> result<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;id&#8221;</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><br /> <span class="token token">&#8220;post_url&#8221;</span><span class="token token punctuation">:</span> result<span class="token token punctuation">.</span>get<span class="token token punctuation">(</span><span class="token token">&#8220;link&#8221;</span><span class="token token punctuation">)</span><span class="token token punctuation">,</span><br /> <span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">:</span> article<span class="token token punctuation">[</span><span class="token token">&#8220;title&#8221;</span><span class="token token punctuation">]</span><br /> <span class="token token punctuation">}</span><span class="token token punctuation">)</span>
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code><span class="token token">if</span> __name__ <span class="token token operator">==</span> <span class="token token">&#8220;__main__&#8221;</span><span class="token token punctuation">:</span><br /> <span class="token token"># HuggingFace Spaces 默认监听 7860 端口</span><br /> app<span class="token token punctuation">.</span>run<span class="token token punctuation">(</span>host<span class="token token operator">=</span><span class="token token">&#8220;0.0.0.0&#8221;</span><span class="token token punctuation">,</span> port<span class="token token operator">=</span><span class="token token">7860</span><span class="token token punctuation">)</span>
        </p>
      </div>
    </div>
  </div>
</div>

## 4.2 依赖文件 <code class="" data-line="">requirements.txt</code> {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          text
        </div>
      </div>
      
      <div>
        <code class="" data-line="">flask&gt;=3.0.0&lt;br />
requests&gt;=2.31.0&lt;br />
beautifulsoup4&gt;=4.12.0&lt;br />
lxml&gt;=5.0.0&lt;br />
gunicorn&gt;=21.0.0&lt;br />
</code>
      </div>
    </div>
  </div>
</div>

## 4.3 Dockerfile {#43-dockerfile.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          text
        </div>
      </div>
      
      <div>
        <code class="" data-line="">&lt;code&gt;# 使用官方 Python 精简镜像作为基础&lt;br />
FROM python:3.11-slim</code></code># 设置工作目录<br /> WORKDIR /app</p> 
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code># 先复制依赖文件，利用 Docker 层缓存<br /> COPY requirements.txt .<br /> RUN pip install &#8211;no-cache-dir -r requirements.txt
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code># 再复制应用代码<br /> COPY app.py .
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code># HuggingFace Spaces 要求以非 root 用户运行<br /> RUN useradd -m -u 1000 appuser<br /> USER appuser
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code># 暴露端口（HF Spaces 固定使用 7860）<br /> EXPOSE 7860
        </p>
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code># 使用 gunicorn 生产级服务器启动<br /> CMD [&#8220;gunicorn&#8221;, &#8220;&#8211;bind&#8221;, &#8220;0.0.0.0:7860&#8221;, &#8220;&#8211;workers&#8221;, &#8220;2&#8221;, &#8220;&#8211;timeout&#8221;, &#8220;60&#8221;, &#8220;app:app&#8221;]
        </p>
      </div>
    </div>
  </div>
</div>

<hr class="bg-quiet h-px border-0" />

## 五、CI/CD 配置（GitHub Actions） {#cicd-github-actions.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

## 5.1 配置 GitHub Secrets {#51--github-secrets.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  在 GitHub 仓库 → <strong>Settings → Secrets and variables → Actions</strong> 中添加以下 Secret：
</p>

<div class="group relative my-[1em]">
  <div class="sticky top-0 z-10 h-0" aria-hidden="true">
    <div class="w-full overflow-hidden bg-raised border-x md:max-w-[90vw] border-subtlest ring-subtlest divide-subtlest">
    </div>
  </div>
  
  <div class="w-full overflow-auto scrollbar-subtle rounded-lg border md:max-w-[90vw] border-subtlest ring-subtlest divide-subtlest bg-raised">
    <table class="[&_tr:last-child_td]:border-b-0 my-0 w-full table-auto border-separate border-spacing-0 text-sm font-sans rounded-lg [&_tr:last-child_td:first-child]:rounded-bl-lg [&_tr:last-child_td:last-child]:rounded-br-lg">
      <tr>
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          Secret 名称
        </th>
        
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          说明
        </th>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">DOCKER_USERNAME</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          Docker Hub 用户名
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">DOCKER_PASSWORD</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          Docker Hub 密码或 Access Token
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">HF_TOKEN</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          HuggingFace Access Token（需要 write 权限）
        </td>
      </tr>
    </table>
  </div>
</div>

## 5.2 GitHub Actions 工作流 <code class="" data-line="">.github/workflows/deploy.yml</code> {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          text
        </div>
      </div>
      
      <div>
        <p>
          <code class="" data-line="">name: Build and Deploy</code>
        </p>
        
        <p>
          on:<br /> push:<br /> branches: [main]
        </p>
        
        <p>
          jobs:<br /> build-and-deploy:<br /> runs-on: ubuntu-latest
        </p>
        
        <p>
          steps:<br /> &#8211; name: Checkout code<br /> uses: actions/checkout@v4
        </p>
        
        <p>
          &#8211; name: Log in to Docker Hub<br /> run: |<br /> echo &#8220;${{ secrets.DOCKER_PASSWORD }}&#8221; | \<br /> docker login -u &#8220;${{ secrets.DOCKER_USERNAME }}&#8221; &#8211;password-stdin
        </p>
        
        <p>
          &#8211; name: Build and push Docker image<br /> run: |<br /> IMAGE=&#8221;${{ secrets.DOCKER_USERNAME }}/wxpush:latest&#8221;<br /> docker build -t $IMAGE .<br /> docker push $IMAGE
        </p>
        
        <p>
          &#8211; name: Sync to HuggingFace Space<br /> env:<br /> HF_TOKEN: ${{ secrets.HF_TOKEN }}<br /> HF_USERNAME: your-hf-username # ← 替换为你的 HF 用户名<br /> SPACE_NAME: wxpush # ← 替换为你的 Space 名称<br /> run: |<br /> git config user.email &#8220;ci@github.com&#8221;<br /> git config user.name &#8220;GitHub Actions&#8221;<br /> git remote add hf \<br /> https://$HF_USERNAME:$HF_TOKEN@huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME<br /> git push hf main &#8211;force
        </p>
      </div>
    </div>
  </div>
</div>

## 5.3 为什么这样能加速 HuggingFace 构建？ {#53--huggingface.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  HuggingFace Spaces Docker 模式<strong>必须通过仓库中的 Dockerfile 重新构建</strong>，无法直接运行预构建镜像。但通过将 <code class="" data-line="">Dockerfile</code> 的基础镜像改写为 Docker Hub 上已预构建好的镜像，HF 构建时直接拉取镜像层，省去了重新安装所有依赖的时间：
</p>

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          text
        </div>
      </div>
      
      <div>
        <code class="" data-line="">&lt;code&gt;# HuggingFace Space 仓库中的 Dockerfile（极简版）&lt;br />
# 直接复用 Docker Hub 上已构建好的镜像层&lt;br />
FROM your-dockerhub-username/wxpush:latest</code></code># 只需做 HF 特定的配置<br /> USER root<br /> RUN useradd -m -u 1000 appuser 2>/dev/null || true<br /> USER appuser</p> 
        
        <p>
          <code class="" data-line="">&lt;code&gt;</code></code>EXPOSE 7860<br /> CMD [&#8220;gunicorn&#8221;, &#8220;&#8211;bind&#8221;, &#8220;0.0.0.0:7860&#8221;, &#8220;&#8211;workers&#8221;, &#8220;2&#8221;, &#8220;&#8211;timeout&#8221;, &#8220;60&#8221;, &#8220;app:app&#8221;]
        </p>
      </div>
    </div>
  </div>
</div>

<hr class="bg-quiet h-px border-0" />

## 六、HuggingFace Spaces 部署配置 {#huggingface-spaces.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

## 6.1 创建 Space {#61--space.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<ol class="marker:text-quiet list-decimal">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      登录 HuggingFace，点击头像 → <strong>New Space</strong>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      Space name 填写 <code class="" data-line="">wxpush</code>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      SDK 选择 <strong>Docker</strong>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      Visibility 选择 <strong>Private</strong>（防止 Webhook 接口被公开访问）
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      点击 <strong>Create Space</strong>
    </p>
  </li>
</ol>

## 6.2 配置 Secrets（环境变量） {#62--secrets.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  在 Space 页面 → <strong>Settings → Variables and secrets</strong> 中添加以下 Secret（选择 Secret 类型，不会明文显示）：
</p>

<div class="group relative my-[1em]">
  <div class="sticky top-0 z-10 h-0" aria-hidden="true">
    <div class="w-full overflow-hidden bg-raised border-x md:max-w-[90vw] border-subtlest ring-subtlest divide-subtlest">
    </div>
  </div>
  
  <div class="w-full overflow-auto scrollbar-subtle rounded-lg border md:max-w-[90vw] border-subtlest ring-subtlest divide-subtlest bg-raised">
    <table class="[&_tr:last-child_td]:border-b-0 my-0 w-full table-auto border-separate border-spacing-0 text-sm font-sans rounded-lg [&_tr:last-child_td:first-child]:rounded-bl-lg [&_tr:last-child_td:last-child]:rounded-br-lg">
      <tr>
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          变量名
        </th>
        
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          示例值
        </th>
        
        <th class="border-subtlest p-sm min-w-[48px] break-normal border-b text-left align-bottom border-r last:border-r-0 font-bold bg-subtle first:border-radius-tl-lg last:border-radius-tr-lg">
          说明
        </th>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">WEBHOOK_SECRET</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">my-secret-2026</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          自定义密钥，用于验证请求合法性
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">WP_URL</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">https://yourblog.com</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          WordPress 站点地址
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">WP_USER</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">admin</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          WordPress 用户名
        </td>
      </tr>
      
      <tr>
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">WP_PASS</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          <code class="" data-line="">xxxx xxxx xxxx xxxx</code>
        </td>
        
        <td class="border-subtlest px-sm min-w-[48px] break-normal border-b border-r last:border-r-0">
          WordPress 应用密码
        </td>
      </tr>
    </table>
  </div>
</div>

## 6.3 确认服务运行 {#63.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  Space 构建完成后，访问 <code class="" data-line="">https://your-hf-username-wxpush.hf.space/health</code>，若返回 <code class="" data-line="">{"status": "ok"}</code> 则服务正常。
</p>

<hr class="bg-quiet h-px border-0" />

## 七、手机端触发配置 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

## 7.1 iOS 快捷指令（推荐） {#71-ios.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  在 iPhone 上创建以下快捷指令，实现从微信「分享」菜单一键触发：
</p>

<ol class="marker:text-quiet list-decimal">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      打开「快捷指令」App，新建快捷指令
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      添加动作：<strong>获取剪贴板</strong> 或 <strong>接收来自分享表单的输入</strong>（类型选 URL）
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      添加动作：<strong>获取 URL 的内容</strong>
    </p>
    
    <ul class="marker:text-quiet list-disc">
      <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
        <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
          URL 填写：<code class="" data-line="">https://your-hf-username-wxpush.hf.space/push</code>
        </p>
      </li>
      
      <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
        <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
          方法：<code class="" data-line="">POST</code>
        </p>
      </li>
      
      <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
        <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
          请求体：<code class="" data-line="">JSON</code>，填入：
        </p>
        
        <div class="w-full md:max-w-[90vw]">
          <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
            <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
              <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
                <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
                </div>
              </div>
            </div>
            
            <div class="-mt-xl">
              <div>
                <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
                  json
                </div>
              </div>
              
              <div>
                <code class="" data-line="">&lt;span class="token token punctuation"&gt;{&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"secret"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;"my-secret-2026"&lt;/span&gt;&lt;span class="token token punctuation"&gt;,&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"url"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt;    &lt;span class="token token"&gt;"快捷指令输入变量"&lt;/span&gt;&lt;br />
&lt;span class="token token punctuation"&gt;}&lt;/span&gt;&lt;br />
</code>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      添加动作：<strong>显示通知</strong>，内容填「文章已推送到 WordPress ✅」
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      保存快捷指令，命名为「推送到 WP」
    </p>
  </li>
</ol>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>使用方式</strong>：在微信文章页面 → 右上角「&#8230;」→ 复制链接 → 运行快捷指令（或通过分享菜单直接触发）。
</p>

## 7.2 Android（HTTP Shortcuts） {#72-androidhttp-shortcuts.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-base.first:mt-0}

<ol class="marker:text-quiet list-decimal">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      安装 <strong>HTTP Shortcuts</strong> App（Google Play 免费）
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      新建快捷方式，类型选 <strong>Regular Shortcut</strong>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      URL：<code class="" data-line="">https://your-hf-username-wxpush.hf.space/push</code>
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      方法：POST，请求体 JSON：
    </p>
    
    <div class="w-full md:max-w-[90vw]">
      <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
        <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
          <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
            <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
            </div>
          </div>
        </div>
        
        <div class="-mt-xl">
          <div>
            <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
              json
            </div>
          </div>
          
          <div>
            <code class="" data-line="">&lt;span class="token token punctuation"&gt;{&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"secret"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;"my-secret-2026"&lt;/span&gt;&lt;span class="token token punctuation"&gt;,&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"url"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;"{clipboard}"&lt;/span&gt;&lt;br />
&lt;span class="token token punctuation"&gt;}&lt;/span&gt;&lt;br />
</code>
          </div>
        </div>
      </div>
    </div>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      将快捷方式添加到桌面，微信复制链接后点击即可触发
    </p>
  </li>
</ol>

<hr class="bg-quiet h-px border-0" />

## 八、关于 HuggingFace Spaces 休眠问题 {#huggingface-spaces.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  免费版 HuggingFace Spaces 在<strong>约 15 分钟无请求后会进入休眠</strong>，冷启动需要 30-60 秒。对于本项目（个人偶发性推送）影响不大，因为：
</p>

<ul class="marker:text-quiet list-disc">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      Webhook 请求会自动唤醒 Space
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      唤醒后再重试即可（iOS 快捷指令可加重试逻辑）
    </p>
  </li>
</ul>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  如需完全避免休眠，可考虑以下方案：
</p>

<ul class="marker:text-quiet list-disc">
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      <strong>升级 HF Pro 账号</strong>：支持持久运行（约 $9/月）
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      <strong>改用 Railway 或 Render</strong>：有限免费时数，但无休眠
    </p>
  </li>
  
  <li class="py-0 my-0 prose-p:pt-0 prose-p:mb-2 prose-p:my-0 [&>p]:pt-0 [&>p]:mb-2 [&>p]:my-0">
    <p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
      <strong>UptimeRobot 定时 Ping</strong>：每 5 分钟请求 <code class="" data-line="">/health</code> 接口保持活跃（免费）
    </p>
  </li>
</ul>

<hr class="bg-quiet h-px border-0" />

## 九、完整测试流程 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  服务部署完成后，可通过以下命令在电脑端先行测试：
</p>

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          bash
        </div>
      </div>
      
      <div>
        <code class="" data-line="">&lt;code&gt;&lt;span class="token token"&gt;# 测试健康检查&lt;/span&gt;&lt;br />
&lt;span class="token token"&gt;curl&lt;/span&gt; https://your-hf-username-wxpush.hf.space/health</code></code><span class="token token"># 测试推送一篇微信文章</span><br /> <span class="token token">curl</span> -X POST https://your-hf-username-wxpush.hf.space/push <span class="token token punctuation">\</span><br /> -H <span class="token token">&#8220;Content-Type: application/json&#8221;</span> <span class="token token punctuation">\</span><br /> -d <span class="token token">&#8216;{<br /> </span><span class="token token"> &#8220;secret&#8221;: &#8220;my-secret-2026&#8221;,<br /> </span><span class="token token"> &#8220;url&#8221;: &#8220;https://mp.weixin.qq.com/s/你的文章ID&#8221;<br /> </span><span class="token token"> }&#8217;</span></p>
      </div>
    </div>
  </div>
</div>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  成功响应示例：
</p>

<div class="w-full md:max-w-[90vw]">
  <div class="codeWrapper bg-subtle text-light selection:text-super selection:bg-super/10 my-md relative flex flex-col rounded-lg font-mono text-sm font-medium">
    <div class="translate-y-xs -translate-x-xs bottom-xl mb-xl flex h-0 items-start justify-end sm:sticky sm:top-xs">
      <div class="overflow-hidden border-subtlest ring-subtlest divide-subtlest bg-base rounded-full">
        <div class="border-subtlest ring-subtlest divide-subtlest bg-subtle">
        </div>
      </div>
    </div>
    
    <div class="-mt-xl">
      <div>
        <div class="text-quiet bg-quiet py-xs px-sm inline-block rounded-br rounded-tl-lg text-xs font-thin" data-testid="code-language-indicator">
          json
        </div>
      </div>
      
      <div>
        <code class="" data-line="">&lt;span class="token token punctuation"&gt;{&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"status"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;"ok"&lt;/span&gt;&lt;span class="token token punctuation"&gt;,&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"post_id"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;123&lt;/span&gt;&lt;span class="token token punctuation"&gt;,&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"post_url"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;"https://yourblog.com/?p=123"&lt;/span&gt;&lt;span class="token token punctuation"&gt;,&lt;/span&gt;&lt;br />
&lt;span class="token token property"&gt;"title"&lt;/span&gt;&lt;span class="token token operator"&gt;:&lt;/span&gt; &lt;span class="token token"&gt;"文章标题"&lt;/span&gt;&lt;br />
&lt;span class="token token punctuation"&gt;}&lt;/span&gt;&lt;br />
</code>
      </div>
    </div>
  </div>
</div>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  然后登录 WordPress 后台 → 文章 → 草稿，即可看到刚刚同步的文章，确认内容无误后手动发布。
</p>

<hr class="bg-quiet h-px border-0" />

## 十、常见问题排查 {#.font-editorial.font-bold.mb-2.mt-4.[.has-inline-images_&]:clear-end.text-lg.first:mt-0.md:text-lg.[hr+&]:mt-4}

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>Q：返回 401 Unauthorized</strong><br /> A：检查请求中的 <code class="" data-line="">secret</code> 字段是否与环境变量 <code class="" data-line="">WEBHOOK_SECRET</code> 一致。
</p>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>Q：WordPress 发布失败，返回 401</strong><br /> A：确认 <code class="" data-line="">WP_USER</code> 和 <code class="" data-line="">WP_PASS</code> 正确，且 WordPress 已生成应用密码（不是登录密码）。
</p>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>Q：文章内容为空</strong><br /> A：wechat-article-exporter API 可能暂时不可用，程序会自动切换到 Fallback 模式直接抓取；若仍为空，可能该文章需要登录才能查看。
</p>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>Q：图片显示为空白</strong><br /> A：检查 <code class="" data-line="">fix_images</code> 函数是否正确替换了 <code class="" data-line="">data-src</code> 属性，部分微信文章使用懒加载图片。
</p>

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <strong>Q：HuggingFace Space 无法访问</strong><br /> A：若 Space 设置为 Private，需要在请求头中加入 HF Token，或改为 Public 并依靠 <code class="" data-line="">secret</code> 字段鉴权。
</p>

<hr class="bg-quiet h-px border-0" />

<p class="my-2 [&+p]:mt-4 [&_strong:has(+br)]:inline-block [&_strong:has(+br)]:pb-2">
  <em>本方案代码已在 Python 3.11 + Flask 3.x 环境下验证，wechat-article-exporter API 由第三方提供，如遇 API 失效请降级使用 Fallback 抓取模式。</em>
</p>