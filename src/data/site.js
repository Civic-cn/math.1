// 网站要显示的"内容"，全都集中在这里。
// 想改标题、改文案、加作品？只动这个文件，组件代码一个字都不用碰。
// 这就是"数据与界面分离"：组件只管"怎么显示"，site.js 只管"显示什么"。
//
// 埋了一颗模块 5 的种子：现在这些值写死在文件里；等后端登场，
// 它们可以改成从网络接口实时取——而组件那边照样一个字都不用动。

export const home = {
  heroTitle: "关于项目",
  heroSubtitle: "类似于一个个人博客项目的起点项目",
  featuredWork: {
    kicker: "a",
    title: "文字实验室",
    copy: "可以挖掘中文里的情绪",
    linkLabel: "点击打开",
  },
  identity: {
    motto: "雄山峻壑终踏过，须信寒过总是春",
    learning: "零到全栈",
  },
};

export const textLab = {
  heroTitle: "让我分析分析",
  heroSubtitle: "看看这句话的情绪如何",
};
