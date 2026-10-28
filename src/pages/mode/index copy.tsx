import React, { useEffect } from 'react';
import { Text, View, navigateBack, updateDpName, getDpsInfos } from '@ray-js/ray';
import { NavBar, Switch, Divider, Slider } from '@ray-js/smart-ui';
import { useActions, useProps, useDevice } from '@ray-js/panel-sdk';
import styles from './index.module.less';

import Res from "../../res/index";

export default (props) => {
  // const { type } = props.location.query;
  console.log('type--->', props.location.query)
  const { devInfo } = useDevice();

  const type = 'qw';
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
   

  useEffect(() => {
    // updateDpName({
    //   devId: devInfo.devId,
    //   dpId: '112',
    //   name: '驱蚊的时间',
    // })
    //   .then((res) => {
    //     console.log('updateDpName',res);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    getDpsInfos({
      devId: devInfo.devId,
      gwId: devInfo.devId,
    })
      .then(res => {
        console.log('getDpsInfos', res);
      })
      .catch(error => {
        console.log(error);
      });
  }, [])

  return (
    <View>
      <NavBar
        className={styles.myNavBar}
        title="驱蚊模式"
        leftArrow
        onClickLeft={() => navigateBack()}
      />
      <View className={styles.view}>
        <View className={styles.content}>
          <View className={styles.nameContent}>
            <Text>功能名称</Text>
            <Text className={styles.text}>驱蚊模式</Text>
            <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
          </View>
          {/* 驱蚊 */}
          { type === 'qw' &&
            <View className={styles.block}>
            <View className={styles.item}>
              <View className={styles.topContent}>
                <View className={styles.left}>
                  <Text>驱蚊时间</Text>
                  <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
            <Divider/>
            <View className={styles.item}>
              <View className={styles.topContent}>
                <View className={styles.left}>
                  <Text>驱蚊药量</Text>
                  <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
            <Divider/>
            <View className={styles.item}>
              <View className={styles.topContent}>
                <View className={styles.left}>
                  <Text>驱蚊频率</Text>
                  <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
          }
          {/* 杀蚊 */}
          { type == 'sw' &&
            <View className={styles.block}>
            <View className={styles.item}>
              <View className={styles.topContent}>
                <View className={styles.left}>
                  <Text>杀蚊时间</Text>
                  <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
            <Divider/>
            <View className={styles.item}>
              <View className={styles.topContent}>
                <View className={styles.left}>
                  <Text>杀蚊药量</Text>
                  <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
            <Divider/>
            <View className={styles.item}>
              <View className={styles.topContent}>
                <View className={styles.left}>
                  <Text>杀蚊频率</Text>
                  <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
          }
          {/* 雾森 */}
          { type == 'ws' &&
            <View className={styles.block}>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>雾森时间</Text>
                    <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
              <Divider/>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>雾森雾量</Text>
                    <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
          }
          {/* 降温 */}
          { type == 'jw' &&
            <View className={styles.block}>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>降温时间</Text>
                    <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
              <Divider/>
              <View className={styles.item}>
                <View className={styles.topContent}>
                  <View className={styles.left}>
                    <Text>降温频率</Text>
                    <image src={Res.editIcon} className={styles.img} mode="widthFix"/>
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
          }
        </View>
      </View>
    </View>
  );
}
