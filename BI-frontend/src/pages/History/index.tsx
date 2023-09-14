import { listMyChartByPageUsingPOST } from '@/services/yubi/chartController';

import { useModel } from '@@/exports';
import { Avatar, Card, List, message, Result } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import Search from 'antd/es/input/Search';

/**
 * 添加图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {

        message.error('Access Chart Failed');
      }
    } catch (e: any) {
      message.error('Access Chart Failed,' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      <div>
        <Search placeholder="Please Input Chart Name" enterButton loading={loading} onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div className="margin-16" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          // @ts-ignore
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                // @ts-ignore
                avatar={<Avatar src={currentUser.userAvatar} />}
                // @ts-ignore
                title={item.name}
                // @ts-ignore
                description={'Chart Type:' + item.chartType}
              />
              <>
                {
                  // @ts-ignore
                  item.status === 'succeed' && (
                    <>
                      <div style={{ marginBottom: 16 }} />

                      <p>{
                        // @ts-ignore
                        'Analysis Goal' + item.goal
                      }
                      </p>
                      <div style={{ marginBottom: 16 }} />
                      <ReactECharts option={// @ts-ignore
                        item.genChart && JSON.parse(item.genChart)} />
                    </>
                  )}
                {// @ts-ignore
                  item.status === 'wait' && (
                    <>
                      <div style={{ marginBottom: 16 }} />

                      <p>{
                        // @ts-ignore
                        'Analysis Goal' + item.goal
                      }
                      </p>
                      <div style={{ marginBottom: 16 }} />
                      <ReactECharts option={// @ts-ignore
                        item.genChart && JSON.parse(item.genChart)} />
                    </>

                    // <>
                    //   <Result
                    //     status="info"
                    //     title="Waiting for generating"
                    //     subTitle={// @ts-ignore
                    //       item.errorMessage ?? 'Please wait'}
                    //   />
                    // </>
                  )}
                {// @ts-ignore
                  item.status === 'running' && (
                    <>
                      <Result status="info" title="Generating" subTitle={// @ts-ignore
                        item.errorMessage} />
                    </>
                  )}
                {// @ts-ignore
                  item.status === 'failed' && (
                    <>
                      <Result status="error" title="Generate Failed" subTitle={// @ts-ignore
                        item.errorMessage} />
                    </>
                  )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default MyChartPage;
