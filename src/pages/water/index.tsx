import React from 'react';
import { Text, View, navigateBack } from '@ray-js/ray';
import { NavBar, Switch, Divider } from '@ray-js/smart-ui';
import { useActions, useProps } from '@ray-js/panel-sdk';
import styles from './index.module.less';

import Res from "../../res/index";

export default (props) => {
  const actions = useActions();
  const water_mode = useProps(props => props.xskg);

  return (
    <View>
      <NavBar
        className={styles.myNavBar}
        title="冬季排水功能"
        leftArrow
        onClickLeft={() => navigateBack()}
      />
      <View className={styles.view}>
        <View className={styles.content}>
          <View className={styles.water_content}>
            <View className={styles.water}>
              <View className={styles.left}>
                <image className={styles.icon} src={Res.waterIcon}  mode="widthFix"/>
                <text className={styles.text}>冬季排水功能</text>
              </View>
              <Switch
                checked={water_mode}
                activeColor="#5CA8DC"
                onChange={event => {
                  actions.xskg.toggle();
                }}
              />
            </View>
            <Divider />
            <View className={styles.tip}>注：关闭进水，打开所有前置过滤下面排水阀后启动！</View>
          </View>
        </View>
      </View>
    </View>
  );
}
