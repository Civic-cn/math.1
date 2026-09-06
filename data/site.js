// 网站要显示的"内容"，全都集中在这里。
// 想改标题、改文案、加作品？只动这个文件，组件代码一个字都不用碰。
// 这就是"数据与界面分离"：组件只管"怎么显示"，site.js 只管"显示什么"。
// 它们可以改成从网络接口实时取——而组件那边照样一个字都不用动。

export const home = {
  heroTitle: "关于我的作品",
  heroSubtitle: "完全的灵感,还在完善更多功能中......",
  featuredWork: {
    kicker: "功能",
    title: "文字实验室",
    copy: "拼音和情绪，挖掘中文里的细节",
    linkLabel: "点击使用",
  },
  identity: {
    motto: "此情可待成追忆，只是当时已惘然",
    coding: "零到全栈",
  },
};

export const textLab = {
  heroTitle: "文字实验室",
  heroSubtitle: "拼音和情绪，挖掘中文里的细节",
};
