import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, navigateBack, updateDpName, getDpsInfos } from '@ray-js/ray';
import { NavBar, Switch, Divider, Slider, Dialog, DialogInstance } from '@ray-js/smart-ui';
import { useActions, useProps, useDevice } from '@ray-js/panel-sdk';
import styles from './index.module.less';

import Res from "../../res/index";

const DP_CONFIG = [
  { dpId: '107', defaultName: '驱蚊模式' },
  { dpId: '108', defaultName: '杀蚊模式' },
  { dpId: '109', defaultName: '雾森模式' },
  { dpId: '110', defaultName: '降温模式' },
  { dpId: '112', defaultName: '驱蚊时间' }, // qwsj
  { dpId: '115', defaultName: '驱蚊药量' }, // qwyl
  { dpId: '118', defaultName: '驱蚊频率' }, // qwpl
  { dpId: '113', defaultName: '杀蚊时间' }, // swsj
  { dpId: '116', defaultName: '杀蚊药量' }, // swyl
  { dpId: '119', defaultName: '杀蚊频率' }, // swpl
  { dpId: '114', defaultName: '雾森时间' }, // wssj
  { dpId: '120', defaultName: '雾森雾量' }, // wspl
  { dpId: '117', defaultName: '降温时间' }, // jwsj
  { dpId: '121', defaultName: '降温频率' }, // jwpl
];

export default (props) => {
  const { dpId } = props.location.query;
  console.log('type--->', props.location.query);
  const { devInfo } = useDevice();
  const devId = devInfo?.devId;

  const actions = useActions();
  const qw_time = useProps(props => props.qwsj);
  const qw_yl = useProps(props => props.qwyl);
  const qw_pl = useProps(props => props.qwpl);

  const sw_time = useProps(props => props.swsj);
  const sw_yl = useProps(props => props.swyl);
  const sw_pl = useProps(props => props.swpl);

  const ws_time = useProps(props => props.wssj);
  const ws_wl = useProps(props => props.wspl);

  const jw_time = useProps(props => props.jwsj);
  const jw_pl = useProps(props => props.jwpl);

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

    DialogInstance.input({
      title: '修改名称',
      value: dpNames[dpId], // 初始值(注意这里参数名是 value,不是 defaultValue)
      placeholder: '请输入功能名称',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      maxlength: 10,
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

  return (
   <View>
      <NavBar
        className={styles.myNavBar}
        title={dpNames[dpId]}
        leftArrow
        onClickLeft={() => navigateBack()}
      />
      <View className={styles.view}>
        <View className={styles.content}>
          {/* <View className={styles.nameContent}>
            <Text>功能名称</Text>
            <Text className={styles.text}>{dpNames[dpId]}</Text>
            <image
              src={Res.editIcon}
              className={styles.img}
              mode="widthFix"
              onClick={() => handleEdit(dpId)}
            />
          </View> */}
          {/* 驱蚊 */}
          {dpId === '107' && (
            <View className={styles.block}>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['112']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('112')}
                    />
                  </View>
                  <View className={styles.value}>{qw_time}分钟</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>1分钟</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={qw_time}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={1}
                      max={5}
                      onAfterChange={value => actions.qwsj.set(value)}
                    />
                  </View>
                  <Text>5分钟</Text>
                </View>
              </View>
              <Divider />
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['115']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('115')}
                    />
                  </View>
                  <View className={styles.value}>{qw_yl}ml</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>0ml</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={qw_yl}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={0}
                      max={380}
                      onAfterChange={value => actions.qwyl.set(value)}
                    />
                  </View>
                  <Text>380ml</Text>
                </View>
              </View>
              <Divider />
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['118']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('118')}
                    />
                  </View>
                  <View className={styles.value}>{qw_pl}%</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>30%</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={qw_pl}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={30}
                      max={100}
                      onAfterChange={value => actions.qwpl.set(value)}
                    />
                  </View>
                  <Text>100%</Text>
                </View>
              </View>
            </View>
          )}
          {/* 杀蚊 */}
          {dpId === '108' && (
            <View className={styles.block}>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['113']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('113')}
                    />
                  </View>
                  <View className={styles.value}>{sw_time}分钟</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>1分钟</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={sw_time}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={1}
                      max={5}
                      onAfterChange={value => actions.swsj.set(value)}
                    />
                  </View>
                  <Text>5分钟</Text>
                </View>
              </View>
              <Divider />
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['116']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('116')}
                    />
                  </View>
                  <View className={styles.value}>{sw_yl}ml</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>0ml</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={sw_yl}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={0}
                      max={380}
                      onAfterChange={value => actions.swyl.set(value)}
                    />
                  </View>
                  <Text>380ml</Text>
                </View>
              </View>
              <Divider />
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['119']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('119')}
                    />
                  </View>
                  <View className={styles.value}>{sw_pl}%</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>30%</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={sw_pl}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={30}
                      max={100}
                      onAfterChange={value => actions.swpl.set(value)}
                    />
                  </View>
                  <Text>100%</Text>
                </View>
              </View>
            </View>
          )}
          {/* 雾森 */}
          {dpId === '109' && (
            <View className={styles.block}>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['114']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('114')}
                    />
                  </View>
                  <View className={styles.value}>{ws_time}分钟</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>1分钟</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={ws_time}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={1}
                      max={60}
                      onAfterChange={value => actions.wssj.set(value)}
                    />
                  </View>
                  <Text>60分钟</Text>
                </View>
              </View>
              <Divider />
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['120']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('120')}
                    />
                  </View>
                  <View className={styles.value}>{ws_wl}%</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>30%</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={ws_wl}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={30}
                      max={100}
                      onAfterChange={value => actions.wspl.set(value)}
                    />
                  </View>
                  <Text>100%</Text>
                </View>
              </View>
            </View>
          )}
          {/* 降温 */}
          {dpId === '110' && (
            <View className={styles.block}>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['117']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('117')}
                    />
                  </View>
                  <View className={styles.value}>{jw_time}分钟</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>1分钟</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={jw_time}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={1}
                      max={10}
                      onAfterChange={value => actions.jwsj.set(value)}
                    />
                  </View>
                  <Text>10分钟</Text>
                </View>
              </View>
              <Divider />
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>{dpNames['121']}</Text>
                    <image
                      src={Res.editIcon}
                      className={styles.img}
                      mode="widthFix"
                      onClick={() => handleEdit('121')}
                    />
                  </View>
                  <View className={styles.value}>{jw_pl}%</View>
                </View>
                <View className={styles.slideContent}>
                  <Text>30%</Text>
                  <View style={{ flex: 1 }}>
                    <Slider
                      minTrackRadius="13px"
                      minTrackHeight="22px"
                      maxTrackRadius="13px"
                      maxTrackHeight="26px"
                      value={jw_pl}
                      thumbWidth={18}
                      thumbHeight={18}
                      parcel
                      parcelMargin={2}
                      min={30}
                      max={100}
                      onAfterChange={value => actions.jwpl.set(value)}
                    />
                  </View>
                  <Text>100%</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
      {/* DialogInstance 需要页面里有这个组件才能渲染 */}
      <Dialog id="smart-dialog" />
    </View>
  );
}
