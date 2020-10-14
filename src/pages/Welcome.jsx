import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';


export default () => (
  // <PageContainer>
    <Card>
      <Alert
        message="ECE444 Group3 Quaranteam"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text strong>
        Main Page
      </Typography.Text>
    </Card>
  // </PageContainer>
);
