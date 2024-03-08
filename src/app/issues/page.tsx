'use client'
import { Layout } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import IssueList from './IssueList';

const { Content } = Layout;


function IssuePage() {

  return (
    <Layout>
      <Content className='bg-white' style={{
        padding: 24,
        minHeight: '100%',
      }}>
        <DndProvider backend={HTML5Backend}>
          <IssueList />
        </DndProvider>
      </Content>
    </Layout>
  )
}

export default IssuePage