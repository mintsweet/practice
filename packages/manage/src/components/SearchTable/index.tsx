import { useState, useEffect, useCallback } from 'react';
import { Form, Row, Col, Button, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { http } from '@/service/api';
import styles from './index.module.less';

export interface QueryFormItem {
  label: string;
  name: string;
  component?: any;
  render?: any;
  initialValue?: string | number | any[];
  rules?: any[];
}

interface Props {
  tableColumns: ColumnProps<any>[];
  tableQueryURL: string;
  queryFormConfig?: QueryFormItem[];
  children?: React.ReactNode;
}

export default function SearchTable({
  tableColumns,
  tableQueryURL,
  queryFormConfig,
  children,
}: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(
    async (p = page, s = pageSize, q = query) => {
      setLoading(true);
      const params: { [key: string]: string | number } = {
        ...q,
        page: p,
        pageSize: s,
      };

      try {
        Object.keys(params).forEach(key => {
          if (typeof params[key] === 'object') {
            params[key] = JSON.stringify(params[key]);
          }
        });

        const data = await http.get(tableQueryURL, params);

        setPage(p);
        setPageSize(s);
        setQuery(q);
        setList(data.list);
        setTotal(data.total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, query, tableQueryURL],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 搜索提交
  const handleQuerySubmit = (values: any) => {
    Object.keys(values).forEach(key => {
      if (!values[key]) {
        delete values[key];
      } else if (typeof values[key] === 'object') {
        values[key] = JSON.stringify(values[key]);
      }
    });

    loadData(page, pageSize, values);
  };

  // 搜索重置
  const handleQueryReset = () => form.resetFields();

  // 页码变化时
  const handleChangePage = (p: number, s?: number) => loadData(p, s);

  // 页面数量变化时
  const handleChangePageSize = (p: number, s: number) => loadData(p, s);

  return (
    <div className={styles.searchTable}>
      {queryFormConfig && queryFormConfig.length > 0 && (
        <Form
          form={form}
          className={styles.queryForm}
          onFinish={handleQuerySubmit}
        >
          <Row>
            {queryFormConfig.map(
              ({ label, name, component, render, initialValue, rules }) => (
                <Col key={name} lg={8}>
                  <Form.Item
                    label={label}
                    name={name}
                    initialValue={initialValue}
                    rules={rules}
                  >
                    {component || render()}
                  </Form.Item>
                </Col>
              ),
            )}
            <Col lg={(3 - (queryFormConfig.length % 3)) * 8}>
              <Form.Item className={styles.searchBtn} label=" " colon={false}>
                <Button
                  style={{ marginRight: 8 }}
                  disabled={loading}
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                >
                  查询
                </Button>
                <Button style={{ marginRight: 8 }} onClick={handleQueryReset}>
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      {children}
      <Table
        className={styles.table}
        rowKey={row => row._id}
        columns={tableColumns}
        dataSource={list}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          hideOnSinglePage: true,
          onChange: handleChangePage,
          onShowSizeChange: handleChangePageSize,
        }}
      />
    </div>
  );
}
