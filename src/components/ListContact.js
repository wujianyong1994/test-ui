import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem, ListView, Accordion } from 'antd-mobile';
import * as config from '../../config.json';
import { observer } from 'mobx-react'
import fetch from '../fetch';
function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }
let pageIndex = 0;
@observer
export default class ListContact extends Component {
    constructor(props){
        super(props);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
        const dataSource = new ListView.DataSource({
            // getRowData,
            // getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource,
            isLoading: true,
            group:{},
            hei:300
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
        const hei = document.documentElement.clientHeight - findDOMNode(this.refs.listview).offsetTop - 50;
        pageIndex = 0;
        const ret = await fetch(config.reqUrl + `/listGroup?pageIndex=${++pageIndex}`, {
            method: 'GET',
        });
        const r = await ret.json();
        if (r.success) {
            this.rData = r.data;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
                hei:hei
            });
        }
        console.log(this.rData);
    }
    async onChange(groupId){
        console.log(this);
        
        if (!this.state.group[groupId]) {
            const ret = await fetch(config.reqUrl + `/listGroupDetail?groupId=${groupId}`, {
                method: 'GET',
            });
            const r = await ret.json();
            if (r.success) {
                const obj = {...this.state.group};
                obj[groupId] = r.data;
                this.setState({group:obj})
            }
        }
    }
    async onEndReached(){
        if (this.state.isLoading && !this.state.hasMore) {
        return;
        }
        this.setState({ isLoading: true });
        const ret = await fetch(config.reqUrl + `/listGroup?pageIndex=${++pageIndex}`, {
            method: 'GET',
        });
        const r = await ret.json();
        if (r.success) {
            this.rData = this.rData.concat(r.data);
            // let dataArray = Object.assign({}, this.rData)
            // console.log(dataArray)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false
            });
        }
        console.log(this.rData);
    }
    row(rowData, sectionID, rowID) {
        const obj = rowData;
        console.log(obj,sectionID,rowID);
        return (
        <div key={rowID} style={{ padding: '0px 0px' }}>
            {this.state.group[obj.id]?this.state.group[obj.id].length:0}
            <Accordion accordion  className="my-accordion" onChange={this.onChange.bind(this,obj.id)}>
                <Accordion.Panel header={obj.name}>
                    <List className="my-list">
                    {this.state.group[obj.id] ? this.state.group[obj.id].map((item,index) => (
                        <List.Item key={index}>{item.name} <a href={'tel:'+item.mobile}>{item.mobile}</a></List.Item>
                    )): ''}
                    </List>
                </Accordion.Panel>
            </Accordion>
        </div>
      );
    };
    separator = (sectionID, rowID) => (
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
    render() {
        
        return (
            <div>
            {/* <span>我的通讯组</span> */}
          <ListView
            ref="listview"
            dataSource={this.state.dataSource}
            renderHeader={() => <span>我的通讯组</span>}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={this.row.bind(this)}
            renderSeparator={this.separator}
            className="am-list"
            pageSize={10}
            style={{
                height: this.state.hei,
                overflow: 'auto',
            }}
            renderBodyComponent={() => <MyBody />}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached.bind(this)}
            onEndReachedThreshold={300}
          />
          </div>
        );
    }
}