import React, { useEffect, useState, useCallback }  from 'react';
import { Text, View, navigateTo, updateDpName, getDpsInfos } from '@ray-js/ray';
import { NavBar, Switch,  Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useActions, useProps, useDevice } from '@ray-js/panel-sdk';
import styles from './index.module.less';

import Res from "../../res/index";

const DP_CONFIG = [
  { dpId: '104', defaultName: '设备流量' },
  { dpId: '105', defaultName: '精油液位' },
  { dpId: '122', defaultName: '药剂液位' },
  { dpId: '106', defaultName: '设备压力' },
  { dpId: '103', defaultName: '运行时间' },
  { dpId: '107', defaultName: '驱蚊模式' },
  { dpId: '108', defaultName: '杀蚊模式' },
  { dpId: '109', defaultName: '雾森模式' },
  { dpId: '110', defaultName: '降温模式' },
];

function Home() {
  const { devInfo } = useDevice();
  const devId = devInfo?.devId;
  const actions = useActions();
  const device_sj = useProps(props => props.sj);
  const device_ll = useProps(props => props.llj);
  const device_jy = useProps(props => props.ywj);
  const device_yl = useProps(props => props.ylcgq);
  const device_yj = useProps(props => props.yjyw);
  const qw_mode = useProps(props => props.qwkg);
  const sw_mode = useProps(props => props.swkg);
  const ws_mode = useProps(props => props.wskg);
  const jw_mode = useProps(props => props.jwkg);

  const [isExp, setExp] = useState(false);

  // ===== 名称状态:以 dpId 为 key,初始值为默认名称 =====
  const [dpNames, setDpNames] = useState<Record<string, string>>(() =>
    DP_CONFIG.reduce((acc, { dpId, defaultName }) => ({ ...acc, [dpId]: defaultName }), {})
  );
  // 读取设备当前 DP 自定义名称
  const loadDpNames = useCallback(async () => {
    if (!devId) return;
    try {
      const res = await getDpsInfos({
        devId,
        gwId: devId,
      });
      console.log('getDpsInfos', res);
      setDpNames(prev => {
        const next = { ...prev };
        DP_CONFIG.forEach(({ dpId }) => {
          // 返回的 dpId 可能是 number,统一转字符串比较
          const dp = res.find(i => String(i.dpId) === dpId);
          // name 为空说明用户没改过,保留默认名称
          if (dp && dp.name) next[dpId] = dp.name;
        });
        return next;
      });
    } catch (error) {
      console.log(error);
    }
  }, [devId]);

  // 点击铅笔:弹输入框 → 保存 → 回显
  const handleEdit = (dpId: string) => {
    // 用局部变量接住输入值,beforeClose 里赋值,then 里使用,最稳
    let inputValue = dpNames[dpId] || '';
    let maxlength = 4;
    if(dpId === '107' || dpId === '108' || dpId === '109' || dpId === '110'){
      maxlength = 10
    }

    DialogInstance.input({
      title: '修改名称',
      value: dpNames[dpId], // 初始值(注意这里参数名是 value,不是 defaultValue)
      placeholder: '请输入功能名称',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      maxlength,
      emptyDisabled: true, // 输入为空时禁用确定按钮
      beforeClose: (action: 'confirm' | 'cancel' | 'overlay', value?: string) =>
        new Promise<boolean>(resolve => {
          if (action !== 'confirm') {
            resolve(true); // 取消/点击遮罩,直接关
            return;
          }
          inputValue = (value || '').trim(); // 截住用户输入
          resolve(!!inputValue); // 空值拦截,不让关
        }),
    }).then(async (res: unknown) => {
        // 优先用回调返回值,拿不到就用 beforeClose 截住的值
        const name = ((typeof res === 'string' ? res : '') || inputValue).trim();
        if (!name || name === dpNames[dpId]) return;
        try {
          const ok = await updateDpName({ devId, dpId, name });
          console.log('updateDpName', ok);
          // 保存成功,本地立即回显,再拉一次校准
          setDpNames(prev => ({ ...prev, [dpId]: name }));
          loadDpNames();
        } catch (error) {
          console.log(error);
        }
    }).catch(() => {
      // 用户取消,不处理
      });
  };

  useEffect(() => {
    loadDpNames();
  }, [loadDpNames]);

  // useEffect(() => {
  //   // 设置失效时间
  //   const today = Date.now();
  //   const targetDay = new Date('2026-11-01');
  //   console.log('组件挂载时执行', today > targetDay);
  //     if(today > targetDay){
  //       setExp(true)
  //     }else{
  //       setExp(false)
  //     }
  // }, []);

  return (
    <View>
      <NavBar title={devInfo.name}/>
      { !isExp && <View className={styles.view}>
        <image src={Res.bgIcon} className={styles.bgContent} mode="widthFix"/>
        <View
          className={styles.content}
        >
        <view className={styles.group}>
          <View className={styles.groupItem}>
            <View className={styles.name}  onLongPress={() => handleEdit('104')}>{dpNames['104']}</View>
            <View className={styles.text}>{ device_ll }<Text className={styles.unit}>L/min</Text></View>
          </View>
          <View className={styles.groupItem}>
            <View className={styles.name} onLongPress={() => handleEdit('105')}>{dpNames['105']}</View>
            <View className={styles.text}>{ device_jy }<Text className={styles.unit}>%</Text></View>
          </View>
          <View className={styles.groupItem}>
            <View className={styles.name} onLongPress={() => handleEdit('122')}>{dpNames['122']}</View>
            <View className={styles.text}>{ device_yj }<Text className={styles.unit}>%</Text></View>
          </View>
          <View className={styles.groupItem}>
            <View className={styles.name} onLongPress={() => handleEdit('106')}>{dpNames['106']}</View>
            <View className={styles.text}>{ device_yl }<Text className={styles.unit}>kg</Text></View>
          </View>
          <View className={styles.groupItem}>
            <View className={styles.name} onLongPress={() => handleEdit('103')}>{dpNames['103']}</View>
            <View className={styles.text}>{ device_sj }<Text className={styles.unit}>min</Text></View>
          </View>
        </view>
        <View>
          <View className={styles.list}>
            <View className={styles.block}>
              <View className={styles.btns}>
                  <Switch
                  checked={qw_mode}
                  activeColor="#5CA8DC"
                  onChange={event => {
                    actions.qwkg.toggle();
                  }}
                />
                <image onClick={() => navigateTo({url:`/pages/mode/index?dpId=107`})} src={Res.setIcon} style="width: 60rpx; height: 60rpx" />
              </View>
              <View className={styles.text} onLongPress={() => handleEdit('107')}>{dpNames['107']}</View>
            </View>
            <View className={styles.block}>
              <View className={styles.btns}>
                  <Switch
                  checked={sw_mode}
                  activeColor="#5CA8DC"
                  onChange={event => {
                    actions.swkg.toggle();
                  }}
                />
                <image onClick={() => navigateTo({url:`/pages/mode/index?dpId=108`})} src={Res.setIcon} style="width: 60rpx; height: 60rpx" />
              </View>
              <View className={styles.text} onLongPress={() => handleEdit('108')}>{dpNames['108']}</View>
            </View>
            <View className={styles.block}>
              <View className={styles.btns}>
                  <Switch
                  checked={ws_mode}
                  activeColor="#5CA8DC"
                  onChange={event => {
                    actions.wskg.toggle();
                  }}
                />
                <image onClick={() => navigateTo({url:`/pages/mode/index?dpId=109`})} src={Res.setIcon} style="width: 60rpx; height: 60rpx" />
              </View>
              <View className={styles.text} onLongPress={() => handleEdit('109')}>{dpNames['109']}</View>
            </View>
            <View className={styles.block}>
              <View className={styles.btns}>
                  <Switch
                  checked={jw_mode}
                  activeColor="#5CA8DC"
                  onChange={event => {
                    actions.jwkg.toggle();
                  }}
                />
                <image onClick={() => navigateTo({url:`/pages/mode/index?dpId=110`})} src={Res.setIcon} style="width: 60rpx; height: 60rpx" />
              </View>
              <View className={styles.text} onLongPress={() => handleEdit('110')}>{dpNames['110']}</View>
            </View>
          </View>
        </View>
        <View className={styles.water}>
          <View className={styles.left}>
            <image className={styles.icon} src={Res.waterIcon}  mode="widthFix"/>
            <text className={styles.text}>冬季排水功能</text>
          </View>
          <image onClick={() => navigateTo({url:`/pages/water/index`})} src={Res.setIcon} style="width: 60rpx; height: 60rpx" />
        </View>
        </View>
      </View>}
      {/* DialogInstance 需要页面里有这个组件才能渲染 */}
      <Dialog id="smart-dialog" />
    </View>
  );
}
export default Home;
