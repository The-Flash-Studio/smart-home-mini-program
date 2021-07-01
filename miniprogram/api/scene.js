"use strict";

export default function getAllConfigScenes(openid) {
  const res = {}
  res.sceneTypeList = [{
      name: '推荐场景',
      sceneList: [{
          name: "回家开灯",
          description: "晚上回家自动开灯",
        },
        {
          name: "我出门了",
          description: "关灯并打开扫地机，打开扫地机，关灯和窗帘，空调调至睡眠模式关",
        },
        {
          name: "晚安",
          description: "关灯和窗帘，空调调至睡眠模式关灯和窗帘，空调调至睡眠模式关灯和窗帘，空调调至睡眠模式",
          hasSet: true,
        },
      ]
    },
    {
      name: '更多玩法',
      sceneList: [{
          name: "碰碰贴的智能玩法",
          description: "一碰尽享智能联动",
        },
        {
          name: "睡眠模式1",
          description: "安享智能睡眠",
          hasSet: true,
        },
        {
          name: "睡眠模式2",
          description: "安享智能睡眠",
        },
      ]
    },
  ]
  return Promise.resolve(res);
}
export {
  getAllConfigScenes
}