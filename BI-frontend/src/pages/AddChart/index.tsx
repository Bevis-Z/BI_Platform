import {genChartByAiUsingPOST} from "@/services/yubi/chartController";
import {UploadOutlined} from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, {useState} from 'react';

/**
 * 添加图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false)
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };
  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    //对接后端上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="Intelligence Analysis">
            <Form name="addChart" labelAlign="left" labelCol={{span: 4}} wrapperCol={{span: 16}} onFinish={onFinish}
                  initialValues={{}}>
              <Form.Item name="goal" label="Aim" rules={[{required: true, message: 'Please input your requirement'}]}>
                <TextArea placeholder={"Please input your requirement. Eg：Analysis the user growth situation"}/>
              </Form.Item>

              <Form.Item
                name="name"
                label="Chart Name"
              >
                <Input placeholder="Please input your chart name."/>
              </Form.Item>
              <Form.Item
                name="chartType"
                label="Chart Type"
              >
                <Select options={[
                  {value: 'Line Chart', label: 'Line Chart'},
                  {value: 'Bar Chart', label: 'Bar Chart'},
                  {value: 'Stacked Chart', label: 'Stacked Chart'},
                  {value: 'Pie Chart', label: 'Pie Chart'},
                  {value: 'RadarChart', label: 'Radar Chart'},
                ]}/>
              </Form.Item>
              <Form.Item
                name="file"
                label="Raw Data"
              >
                <Upload name = "file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>Upload CSV File</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 16, offset: 4}}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    Submit
                  </Button>
                  <Button htmlType="reset">Reset</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Output">
            {chart?.genResult ?? <div>Waiting for submit.</div>}
            <Spin spinning={submitting}/>
          </Card>
          <Divider/>
          <Card title="Chart">
            {
              option ? <ReactECharts option={option}/> : <div>Waiting for submit.</div>
            }
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
