import React, { useState, useEffect } from 'react';
import { Space, Modal, Typography, Button, Form } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
import { IssueProps } from './IssueList'
const { TextArea } = Input;
const { Text } = Typography;

interface IssueModalProps {
  isModalOpen: boolean,
  handleCancel: () => void,
  issue: IssueProps | null
}

const ViewIssueModal: React.FC<IssueModalProps> = ({ isModalOpen, handleCancel, issue }) => {

  return (
    <Modal title={issue?.title}
      open={isModalOpen}
      width={700}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <p>{issue?.description}</p>
    </Modal>
  );
};

export default ViewIssueModal;