import React, { Component } from 'react';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem, ListView } from 'antd-mobile';
import * as config from '../../config.json';
import fetch from '../fetch';

export default class ListContact extends Component {
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource,
            isLoading: true,
        };
    }
    async componentDidMount() {
        // you can scroll to the specified position
        // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    
        // simulate initial Ajax
        // setTimeout(() => {
        //   this.rData = genData();
        //   this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(this.rData),
        //     isLoading: false,
        //   });
        // }, 600);
        const ret = await fetch(config.reqUrl + `/listGroup`, {
            method: 'GET',
        });
        const r = await ret.json();
        if (r.success) {
            this.rData = r.data;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
            });
        }
        console.log(this.rData);
    }
    render() {
        const separator = (sectionID, rowID) => (
          <div
            key={`${sectionID}-${rowID}`}
            style={{
              backgroundColor: '#F5F5F9',
              height: 8,
              borderTop: '1px solid #ECECED',
              borderBottom: '1px solid #ECECED',
            }}
          />
        );
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
            <div key={rowID} style={{ padding: '5px 15px' }}>
                {obj.name}
            </div>
          );
        };
        return (
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderHeader={() => <span>我的通讯组</span>}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={row}
            renderSeparator={separator}
            className="am-list"
            pageSize={4}
            useBodyScroll
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        );
    }
}