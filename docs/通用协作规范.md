# 参考

https://github.com/GDJiaMi/frontend-standards

https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow

# 1、工作流规范（基于Git）

## 1.1、开发

### 1.1.1、[版本规范](https://semver.org/lang/zh-CN/)

版本格式：主版本号.次版本号.修订号，版本号递增规则如下：

1. 主版本号：当你做了不兼容的 API 修改，
2. 次版本号：当你做了向下兼容的功能性新增，
3. 修订号：当你做了向下兼容的问题修正。

先行版本号及版本编译元数据可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

### 1.1.2、Git分支模型

#### master分支

master分支表示一个稳定的发布版本. 对应百宝袋的大版本.

- 场景: 所有应用会跟随版本迭代, 在dev分支测试稳定后, 会合并到master分支, 并使用tag标记应用版本
- tag规范: `v{version}`, 例如v0.1.0
- 人员: 由项目负责人进行审核合并, 普通开发者没有权限

#### dev分支

开发者主要工作的分支, 最新的特性或bug修复都会提交到这个分支. 开发者如果在该分支进行了提交，在push到远程之前应该先pull一下， 并尽量使用rebase模式，保证分支的简洁

- 命名规范: dev
- tag规范: 在dev分支中也可能会经历发布过程, 例如bug修复版本. 这里同样使用tag来标记这些发布. 例如v0.1.1
- 提交规范：如果实在开发分支上进行开发，在推送到远程之前，应该使用`git rebase`形式更新本地分支。

#### feature分支

涉及多人协作或者大功能的开发, 应该从dev分支checkout出独立的feature分支, 避免干扰dev分支

- 场景:
  - 涉及多人协作: 团队多个成员在同一个项目下负责开发不同的功能, 这时候每个成员在自己的feature分支独立开发
  - 大功能开发: 大功能开发跨越周期比较长, 需要多次迭代才会稳定. 这时候应该在独立的分支上开发. 方便跟踪历史记录, 也免于干扰dev分支的迭代和发布
- 命名规范
  - feature/name: name是功能名称
  - feature/version: 这也是团队常见的模式, 当无法使用一个功能名称来描述时, 可以使用版本号作为’功能’
- 合并时机
  1. 当feature分支迭代稳定, 并通过测试后, 合并到dev分支. 合并到dev后, **feature分支的生命周期就结束了**. 后续bug修复和功能优化直接在dev开发
  2. 当多个feature分支需要合并对外发布临时版本时. 合并到preview分支 . ⚠️这种情况不应该合并到dev分支, 因为feature分支可能还不稳定或未完成. 比如为了联调某些功能.
- 合并方式
  - 不要使用fast-forward. 这样可以在分支图上查看到分支历史

#### preview分支

临时的预览分支, preview分支用于临时合并feature分支, 这其中可能会修复某些bug或者冲突. 可以选择性地将这些提交cherrypick回feature分支. 当预览结束后就可以销毁preview分支

#### release分支

遵循gitflow规范

- 场景: 需要为某个正式版本修复bug(hotFix)时, 从master的对应tag中checkout release分支
- 命名规范: release/{version} 
- 如何修复
    + 如果对应bug可以在dev分支直接被修复, 可以先提交到dev分支(或者已经修复了), 然后再cherrypick到release分支
    + 如果bug在新版本无法复现. 比如新版本升级了依赖. 那么在release分支直接修复即可

### 1.1.3、提交信息规范

#### 格式

我们采用angular的提交规范, 在这个规范的基础上支持(可选)`emoji`进行修饰

```
<type>(<scope>): <subject>

<body>

<footer>
```

##### header

> 如果提交时feature或者fix(已发布的版本), 这些提交信息应该出现在CHANGELOG

- type: 说明commit的类别. 可以配合emoji使用, 让阅读者更快地区分提交的类型,允许以下类型:
  - feature或feat: 引入新功能
  - fix: 修复了bug
  - docs: 文档
  - style: 优化项目结构或者代码格式
  - refactor: 代码重构. 代码重构不涉及新功能和bug修复. 不应该影响原有功能, 包括对外暴露的接口
  - test: 增加测试
  - chore: 构建过程, 辅助工具升级. 如升级依赖, 升级构建工具
  - perf: 性能优化
  - revert: revert之前的commit
    - git revert 命令用于撤销之前的一个提交, 并在为这个撤销操作生成一个提交
  - build或release: 构建或发布版本
  - ci: 持续集成
  - types: 类型定义文件更改
  - workflow: 工作流改进
  - wip: 开发中
  - safe: 修复安全问题
- scope: 可选. 说明提交影响的范围. 例如样式, 后端接口, 逻辑层等等
- Subject: 提交目的的简短描述, 动词开头, 不超过80个字符. 不要为了提交而提交

##### body

可选. 对本次提交的详细描述. 如果变动很简单, 可以省略

##### footer

可选. 只用于说明不兼容变动(break change)和关闭 Issue(如果使用使用gitlab或github管理bug的话)

#### 模板参考

https://github.com/angular/angular/commits/master

```
# 新增一条 Commit 记录
git commit -m 'chore(package.json): 新增 AngularJS 规范，Commit 时会自动调用钩子（GitHook）来判断 Message 是否有效'

# 搜索跟 package.json 文件相关的历史记录
git log HEAD --grep chore(package.json)
```

### 1.1.4、BUG处理规则

对于测试，目前会经历两个阶段

- 冒烟测试：在对测试正式发版之前会要求对代码进行自测，及冒烟测试。
- 正式测试阶段：正式测试阶段测试人员会在RDMS进行bug提交和管理，对BUG的处理规则如下：
      - [解决待关闭]: 修改了程序代码, 问题解决;
      - [不做处理]: 没有修改程序代码, 是由于其他原因(需求变更等), 而解决的问题;
      - [退回]: 无规律或只出现一次的BUG, 研发没找到原因, 加上必要排查日志后, 可退回给测试; 复现后重新打开
      - [正在处理]: 已大致定位原因, 需要较多时间处理的BUG, 可置为"正在处理"

> BUG的数量可能会和个人的KPI挂钩。所以要谨慎自测

### 1.1.5、处理定制化需求

- 痛点
  - 对于定制化需求, 并不会引入到正规的代码流中, 一般情况下会checkout出一个分支, 来专门做这里定制化需求, 然后单独发版. 使用分支模式的缺点有:
    - 更新问题
      - 每次正规代码更新都要合并到该分支. 当分支较多时分支图就会比较混乱
      - 正规代码合并是必然会带来风险的, 比如项目结构变动, 依赖库变动. 都可能导致定制化的代码失效
- 解决办法
  - 减少代码耦合
    - 尽量将定制化需求模块化, 最小化和正规代码之间的接触面. 这是解决该问题最根本的方式.
      - 检验方式是结构变化时, 没有或很少适配代码
  - 考虑通过代码层面区分
    - 例如通过权限系统来配置. 通过后端接口动态配置
  - 优先使用fork模式
    - 有些场景确实无法通过代码层面解决, 比如ios应用定制启动图, icon, 应用名称, 外观等等. 这种方式优先使用fork模式, fork模式和分支模式没本质区别, 但是至少可以避免干扰正规开发流程

## 1.2、发布工作流

- 流程
  1. 进行代码变更
  2. 提交这些变更, 进行CI让这些变更通过测试
     - 如果没通过就打tag, 一旦出现测试失败, tag就得重新打
  3. 提升package.json的版本号, 更新CHANGELOG.md
  4. 打上tag, 提交
  5. 可选. 合并到release分支
- 工具
  - 使用[jm-deploy release](https://github.com/carney520/jm-deploy)自动化发布并生成CHANGELOG.md

## 1.3、持续集成

所有项目基于coding的持续集成来完成。

## 1.4、扩展

- [如何写好 Git commit log?](https://www.zhihu.com/question/21209619)
- [提交信息emoji规范](https://gitmoji.carloscuesta.me/)
- [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
- [Git远程操作详解](http://www.ruanyifeng.com/blog/2014/06/git_remote.html)
- [git钩子定制团队代码提交流程规范](https://www.jianshu.com/p/527e34f53b51)
- [保持fork之后的项目和上游同步](https://github.com/staticblog/wiki/wiki/保持fork之后的项目和上游同步)

# 2、编码规范

## 2.1、代码格式化

- [Prettier](https://prettier.io/) -  关于代码格式化的所有东西都交给它吧！

基本上，所有代码格式相关的工作都可以交给Prettier来做，在这个基础上再使用Eslint覆盖语义相关的检查

## 2.2、Code Review

#### Architecture/Design

- 单一职责原则.
  - 这是经常被违背的原则。一个类只能干一个事情, 一个方法最好也只干一件事情。 比较常见的违背是一个类既干UI的事情，又干逻辑的事情, 这个在低质量的代码里很常见。

- 行为是否统一

  - 比如缓存是否统一，错误处理是否统一， 错误提示是否统一， 弹出框是否统一 等等。
  - 同一逻辑/同一行为 有没有走同一Code Path？低质量程序的另一个特征是，同一行为/同一逻辑，因为出现在不同的地方或者被不同的方式触发，没有走同一Code Path 或者各处有一份copy的实现， 导致非常难以维护。

- 代码污染

  - 代码有没有对其他模块强耦合 ？

- 重复代码

  - 主要看有没有把公用组件，可复用的代码，函数抽取出来。

- Open/Closed 原则

  - 就是好不好扩展。 Open for extension, closed for modification.

- 面向接口编程 和 不是 面向实现编程

  - 主要就是看有没有进行合适的抽象， 把一些行为抽象为接口。

- 健壮性

  - 对Corner case有没有考虑完整，逻辑是否健壮？有没有潜在的bug？
  - 有没有内存泄漏？有没有循环依赖?（针对特定语言，比如Objective-C) ？有没有野指针？
  - 有没有考虑线程安全性， 数据访问的一致性

- 错误处理

  - 有没有很好的Error Handling？比如网络出错，IO出错。

- 改动是不是对代码的提升

  - 新的改动是打补丁，让代码质量继续恶化，还是对代码质量做了修复？

- 效率/性能

  - 客户端程序 对频繁消息 和较大数据等耗时操作是否处理得当。
  - 关键算法的时间复杂度多少？有没有可能有潜在的性能瓶颈。

其中有一部分问题，比如一些设计原则， 可预见的效率问题， 开发模式一致性的问题 应该尽早在Design Review阶段解决。如果Design阶段没有解决，那至少在Code Review阶段也要把它找出来。

#### Style

- 可读性

  - 衡量可读性的可以有很好实践的标准，就是Reviewer能否非常容易的理解这个代码。 如果不是，那意味着代码的可读性要进行改进。

- 命名

  - 命名对可读性非常重要，我倾向于函数名/方法名长一点都没关系，必须是能自我阐述的。
  - 英语用词尽量准确一点（哪怕有时候需要借助Google Translate，是值得的）

- 函数长度/类长度

  - 函数太长的不好阅读。 类太长了，比如超过了1000行，那你要看一下是否违反的“单一职责” 原则。

- 注释

  - 恰到好处的注释。 但更多我看到比较差质量的工程的一个特点是缺少注释。

- 参数个数

  - 不要太多， 一般不要超过3个。

#### Review Your Own Code First

- 跟著名的橡皮鸭调试法（Rubber Duck Debugging）一样，每次提交前整体把自己的代码过一遍非常有帮助，尤其是看看有没有犯低级错误。

#### 如何进行Code Review

- 多问问题。多问 “这块儿是怎么工作的？” “如果有XXX case，你这个怎么处理？”
- 每次提交的代码不要太多，最好不要超过1000行，否则review起来效率会非常低。
- 当面讨论代替Comments。 大部分情况下小组内的同事是坐在一起的，face to face的 code review是非常有效的。
- 区分重点，不要舍本逐末。 优先抓住 设计，可读性，健壮性等重点问题。

#### Code Review的意识

- 作为一个Developer , 不仅要Deliver working code, 还要Deliver maintainable code.
- 必要时进行重构，随着项目的迭代，在计划新增功能的同时，开发要主动计划重构的工作项。
- 开放的心态，虚心接受大家的Review Comments。

# 3、文档规范

## 3.1、文档中心

采用Coding提供的WIKI作为文档中心，采用Markdown格式。

可视化编辑器

- **Visual Code**: 大部分代码编辑都支持Markdown编辑和预览
- [**Mou**](https://link.jianshu.com/?t=http://mouapp.com/): Mac下的老牌编辑器
- [**typora**](https://typora.io/): 跨平台的Markdown编辑器，推荐

## 3.2、代码即文档

通过‘代码即文档’的方式至少可以**保持文档和代码同步更新**；另外**很多工具会分析代码的数据类型**，自动帮我们生成参数和返回值定义，这也可以减少很多文档编写工作以及出错率。

相关的工具有:

- API文档 
  - Typescript 
    - [tsdoc](https://github.com/microsoft/tsdoc) Typescript官方的注释文档标准
    - [typedoc](https://github.com/TypeStrong/typedoc) 基于tsdoc标准的文档生成器
  - Javascript 
    - [jsdoc](https://github.com/jsdoc/jsdoc) Javascript文档注释标准和生成器
- 后端接口文档 
  - [Swagger](https://swagger.io) Restful接口文档规范
  - GraphQL: 这个有很多工具，例如[graphiql](https://github.com/graphql/graphiql), 集成了Playground和文档，很先进
  - [Easy Mock](https://easy-mock.com/login) 一个可视化，并且能快速生成模拟数据的服务
- 组件文档 
  - [StoryBook](https://storybook.js.org) 通用的组件开发、测试、文档工具
  - React 
    - [Docz](http://docz.site)
    - [Styleguidist](https://github.com/styleguidist/react-styleguidist)
  - Vue 
    - [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist)

## 3.3、注释即文档

**必要和适量的注释对阅读源代码的人来说就是一个路牌, 可以少走很多弯路**.

关于注释的一些准则，[<阿里巴巴Java开发手册>](https://github.com/alibaba/p3c/blob/master/p3c-gitbook/编程规约/注释规约.md)总结得非常好, 推荐基于这个来建立注释规范。另外通过ESlint是可以对注释进行一定程度的规范。

# 4、UI规范

待定

# 5、测试规范

![图片](/api/project/281160/files/2347052/imagePreview)

## 单元测试

单元测试有很多**好处**, 比如:

- **提高信心，适应变化和迭代**. 如果现有代码有较为完善的单元测试，在代码重构时，可以检验模块是否依然可以工作, 一旦变更导致错误，单元测试也可以帮助我们快速定位并修复错误
- **单元测试是集成测试的基础**
- **测试即文档**。如果文档不能解决你的问题，在你打算看源码之前，可以查看单元测试。通过这些测试用例，开发人员可以直观地理解程序单元的基础API
- **提升代码质量。易于测试的代码，一般都是好代码**

**测什么?**

业务代码或业务组件是比较难以实施单元测试的，一方面它们比较多变、另一方面很多团队很少有精力维护这部分单元测试。所以**通常只要求对一些基础/底层的组件、框架或者服务进行测试, 视情况考虑是否要测试业务代码**

**测试的准则**:

- 推荐Petroware的[Unit Testing Guidelines](https://petroware.no/unittesting.html), 总结了27条单元测试准则，非常受用.
- 另外<阿里巴巴的Java开发手册>中总结的[单元测试准则](https://github.com/alibaba/p3c/blob/master/p3c-gitbook/单元测试.md), 也不错，虽然书名是Java，准则是通用的.

**单元测试指标**:

一般使用[`测试覆盖率`](https://zh.wikipedia.org/wiki/代碼覆蓋率)来量化，尽管对于覆盖率能不能衡量单元测试的有效性存在较多争议。

大部分情况下还是推荐尽可能提高覆盖率, 比如要求`语句覆盖率达到70%；核心模块的语句覆盖率和分支覆盖率都要达到100%`. 视团队情况而定

扩展:

- [测试覆盖（率）到底有什么用？](https://www.infoq.cn/article/test-coverage-rate-role)
- [阿里巴巴Java开发文档-单元测试](https://www.kancloud.cn/kanglin/java_developers_guide/539190)

**相关工具**

- Headless Browsers: 无头浏览器是网页自动化的重要运行环境。 常用于功能测试、单元测试、网络爬虫 

  - [puppeteer](https://github.com/GoogleChrome/puppeteer)
  - [Headless Chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)

- 测试框架 

  - Jest

    Facebook的单元测试框架. 零配置, 支持组件快照测试、模块Mock、Spy. 一般场景, 单元测试学它一个就行了 

    - 组件测试 
      - [testing-library](https://github.com/testing-library) 
      - [Enzyme](https://github.com/airbnb/enzyme)

  - [Intern](https://theintern.github.io/)

- 单元测试 

  - [AVA](https://github.com/avajs/ava)
  - [Jasmine](http://jasmine.github.io/)
  - [Mocha](http://mochajs.org/)
  - [Tape](https://github.com/substack/tape)

- 断言库 

  - [Chai](http://chaijs.com/)
  - [expect.js](https://github.com/Automattic/expect.js)
  - [should.js](http://shouldjs.github.io/)

- Mock/Stubs/Spies 

  - [sinon.js](http://sinonjs.org/)

- 代码覆盖率 

  - [istanbul](https://github.com/gotwarlost/istanbul)

- 基准测试 

  - [benchmark.js](http://benchmarkjs.com/)
  - [jsperf.com](https://jsperf.com/)

# 6、异常处理、监控

## 6.1、异常处理

参考《阿里巴巴开发手册》中的[异常处理]([https://github.com/alibaba/p3c/blob/master/p3c-gitbook/%E5%BC%82%E5%B8%B8%E6%97%A5%E5%BF%97/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86.md](https://github.com/alibaba/p3c/blob/master/p3c-gitbook/异常日志/异常处理.md))

## 6.2、日志

- 避免重复打印日志
- 谨慎地记录日志, 划分日志级别。比如生产环境禁止输出debug日志；有选择地输出info日志；
- 使用前缀对日志进行分类, 例如: `[User] xxxx`

## 6.2、异常监控

异常监控通常会通过三种方式来收集异常数据:

1. 全局捕获。
2. 主动上报。在try/catch中主动上报.
3. 用户反馈。比如弹窗让用户填写反馈信息.

第三方工具推荐

- [Bugly](https://bugly.qq.com/v2/) 免费
- [Sentry](https://sentry.io/welcome/) 免费基本够用

# 7、前后端协作规范

## 7.1、协作流程

前后端协作流程如下:

![图片](/api/project/281160/files/2347269/imagePreview)

1、需求分析。参与者一般有前后端、测试、以及产品. 由产品主持，对需求进行宣贯，接受开发和测试的反馈，确保大家对需求有一致的认知

2、前后端开发讨论。讨论应用的一些开发设计，沟通技术点、难点、以及分工问题.

3、设计接口文档。可以由前后端一起设计；或者由后端设计、前端确认是否符合要求

4、并行开发。前后端并行开发，在这个阶段，前端可以先实现静态页面; 或者根据接口文档对接口进行Mock, 来模拟对接后端接口

5、在联调之前，要求后端做好接口测试

6、真实环境联调。前端将接口请求代理到后端服务，进行真实环境联调。

## 7.2、接口规范

采用RESTFUL设计规范。

**需要注意的点**:

- 明确区分是正常还是异常, 严格遵循接口的异常原语. 上述接口形式都有明确的异常原语，比如JSONRPC，当出现异常时应该返回`错误对象`响应，而不是在正常的响应体中返回错误代码. 另外要规范化的错误码, HTTP响应码就是一个不错的学习对象
- 明确数据类型。很多后端写的接口都是string和number不分的，如果妥协的话、前端就需要针对这个属性做特殊处理，这也可能是潜在的bug
- 明确空值的意义。比如在做更新操作是，空值是表示重置，还是忽略更新？
- 响应避免冗余的嵌套。
- 接口版本化，保持向下兼容。就像我们上文的‘语义化版本规范’说的，对于后端来说，API就是公共的接口. 公共暴露的接口应该有一个版本号，来说明当前描述的接口做了什么变动，是否向下兼容。 现在前端代码可能会在客户端被缓存，例如小程序。如果后端做了break change，就会影响这部分用户。

## 7.3、接口文档规范

后端通过接口文档向前端暴露接口相关的信息。通常需要包含这些信息：

- 版本号
- 文档描述
- 服务的入口. 例如基本路径
- 测试服务器. 可选
- 简单使用示例
- 安全和认证
- 请求限制
- 错误说明
- 版本
- 字段类型
- 具体接口定义 
  - 方法名称或者URL
  - 方法描述
  - 请求参数及其描述，必须说明类型(数据类型、是否可选等)
  - 响应参数及其描述, 必须说明类型(数据类型、是否可选等)
  - 可能的异常情况、错误代码、以及描述
  - 请求示例，可选

> 也可采用Coding提供的API文档模板来改写

**人工维护导致的问题**:

上文‘代码即文档’就提到了人工维护接口文档可能导致代码和文档不同步问题。

如果可以从代码或者规范文档(例如OpenAPI这类API描述规范)中生成接口文档，可以解决实现和文档不一致问题, 同时也可以减少文档编写和维护的投入.

**项目采用Coding提供的API文档来自动生成API文档。**


