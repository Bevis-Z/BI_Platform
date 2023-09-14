import { genChartByAiAsyncUsingPOST } from '@/services/yubi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Select, Space, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';



/**
 * 添加图表（异步）页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title="Intelligence Analysis">
        <Form form={form} name="addChart" labelAlign="left" labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }} onFinish={onFinish} initialValues={{}}>
          <Form.Item
            name="goal"
            label="Aim"
            rules={[{ required: true, message: 'Please input your requirement' }]}
          >
            <TextArea placeholder="Please input your requirement. Eg：Analysis the user growth situation" />
          </Form.Item>
          <Form.Item name="name" label="Chart Name">
            <Input placeholder="Please input your chart name." />
          </Form.Item>
          <Form.Item name="chartType" label="Chart Type">
            <Select
              options={[
                {value: 'Line Chart', label: 'Line Chart'},
                {value: 'Bar Chart', label: 'Bar Chart'},
                {value: 'Stacked Chart', label: 'Stacked Chart'},
                {value: 'Pie Chart', label: 'Pie Chart'},
                {value: 'RadarChart', label: 'Radar Chart'},
              ]}
            />
          </Form.Item>
          <Form.Item name="file" label="Raw Data">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload CSV File</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                Submit
              </Button>
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
