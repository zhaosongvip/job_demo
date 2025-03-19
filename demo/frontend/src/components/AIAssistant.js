import React, { useState } from 'react';
import { Button, Card, message, Space, Tooltip, Divider } from 'antd';
import { 
  FileTextOutlined, 
  TagsOutlined, 
  EditOutlined,
  FileSearchOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { aiApi } from '../services/api';

const AIAssistant = ({ content, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAIAction = async (action) => {
    if (!content) {
      message.warning('请先输入文章内容');
      return;
    }

    try {
      setLoading(true);
      let result;
      
      message.loading({
        content: '正在调用 AI 服务...',
        key: 'aiAction',
        duration: 0
      });
      
      switch (action) {
        case 'summary':
          result = await aiApi.generateSummary(content);
          onUpdate(result.data, 'summary');
          break;
        case 'tags':
          result = await aiApi.suggestTags(content);
          onUpdate(result.data, 'tags');
          break;
        case 'improve':
          result = await aiApi.improveWriting(content);
          onUpdate(result.data, 'improve');
          break;
        case 'title':
          result = await aiApi.generateTitle(content);
          onUpdate(result.data, 'title');
          break;
        case 'recommend':
          result = await aiApi.recommendPosts(content);
          message.info('相关主题推荐：\n' + result.data);
          break;
        default:
          break;
      }
      
      message.success({
        content: 'AI 助手已完成操作！',
        key: 'aiAction'
      });
    } catch (error) {
      message.error({
        content: '操作失败：' + (error.response?.data || error.message) + 
          '\n请稍后重试',
        key: 'aiAction',
        duration: 5
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    width: '120px',
    height: '40px',
    margin: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  return (
    <Card 
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '16px',
          color: '#1890ff'
        }}>
          <EditOutlined />
          AI 写作助手
        </div>
      }
      style={{ 
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}
    >
      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '4px' }}>
            内容生成
          </div>
          <Space direction="vertical" size="small">
            <Tooltip title="自动生成文章摘要">
              <Button 
                icon={<FileTextOutlined />}
                onClick={() => handleAIAction('summary')} 
                loading={loading}
                style={buttonStyle}
                type="default"
              >
                生成摘要
              </Button>
            </Tooltip>
            <Tooltip title="生成吸引人的标题">
              <Button 
                icon={<FileSearchOutlined />}
                onClick={() => handleAIAction('title')} 
                loading={loading}
                style={buttonStyle}
                type="default"
              >
                生成标题
              </Button>
            </Tooltip>
          </Space>
        </div>

        <Divider type="vertical" style={{ height: '100px' }} />

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '4px' }}>
            内容优化
          </div>
          <Space direction="vertical" size="small">
            <Tooltip title="优化文章内容">
              <Button 
                icon={<EditOutlined />}
                onClick={() => handleAIAction('improve')} 
                loading={loading}
                style={buttonStyle}
                type="primary"
              >
                优化内容
              </Button>
            </Tooltip>
            <Tooltip title="推荐相关标签">
              <Button 
                icon={<TagsOutlined />}
                onClick={() => handleAIAction('tags')} 
                loading={loading}
                style={buttonStyle}
                type="default"
              >
                推荐标签
              </Button>
            </Tooltip>
          </Space>
        </div>

        <Divider type="vertical" style={{ height: '100px' }} />

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '4px' }}>
            相关推荐
          </div>
          <Tooltip title="获取相关主题推荐">
            <Button 
              icon={<BranchesOutlined />}
              onClick={() => handleAIAction('recommend')} 
              loading={loading}
              style={buttonStyle}
              type="default"
            >
              相关推荐
            </Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant; 