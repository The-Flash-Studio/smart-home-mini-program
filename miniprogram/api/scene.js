"use strict";

export default function getAllConfigScenes(openid) {
  const res = {}
  res.sceneTypeList = [{
    name: '推荐场景',
    sceneList: [{
      name: "回家开灯",
      description: "晚上回家自动开灯",
      sceneType: 1,
    },
    {
      name: "我出门了",
      description: "关灯并打开扫地机，打开扫地机，关灯和窗帘，空调调至睡眠模式关",
      sceneType: 2,
    },
    {
      name: "晚安",
      description: "关灯和窗帘，空调调至睡眠模式关灯和窗帘，空调调至睡眠模式关灯和窗帘，空调调至睡眠模式",
      hasSet: true,
      sceneType: 3,
    },
    ]
  },
  {
    name: '更多玩法',
    sceneList: [{
      name: "碰碰贴的智能玩法",
      description: "一碰尽享智能联动",
      sceneType: 4,
    },
    {
      name: "睡眠模式1",
      description: "安享智能睡眠",
      hasSet: true,
      sceneType: 5,
    },
    {
      name: "睡眠模式2",
      description: "安享智能睡眠",
      sceneType: 6,
    },
    ]
  },
  ]
  return Promise.resolve(res);
}
export {
  getAllConfigScenes
}