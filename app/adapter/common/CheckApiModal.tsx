import React from 'react';
import { Modal, Form, Select, message } from 'antd';
import useModelListStore from '@/app/store/modelList';
import { useTranslations } from 'next-intl';

type CustomModelModalProps = {
  isCheckApiModalOpen: boolean;
  setIsCheckApiModalOpenOpen: (open: boolean) => void;
  startCheck: (modelId: string) => void;
};

const CheckApiModal: React.FC<CustomModelModalProps> = ({
  isCheckApiModalOpen,
  setIsCheckApiModalOpenOpen,
  startCheck,
}) => {
  const t = useTranslations('Admin.Models');
  const [customModelForm] = Form.useForm();
  const { modelList } = useModelListStore();

  const onModelFormSubmit = async (values: {
    modelId: string;
  }) => {
    if (!values.modelId) {
      // 如果没有选择模型，直接测试连接
      startCheck('');
    } else {
      startCheck(values.modelId);
    }
    setIsCheckApiModalOpenOpen(false);
  };

  return (
    <Modal
      title={t('checkConnectivity')}
      maskClosable={false}
      keyboard={false}
      centered={true}
      okText={t('confirm')}
      cancelText={t('cancelText')}
      open={isCheckApiModalOpen}
      width={400}
      onOk={() => customModelForm.submit()}
      onCancel={() => setIsCheckApiModalOpenOpen(false)}
    >
      <div className='mt-4'>
        <Form
          layout="vertical"
          form={customModelForm}
          onFinish={onModelFormSubmit}
          initialValues={{
            modelId: modelList.length > 0 ? modelList[0].id : ''
          }}
        >
          <Form.Item
            name='modelId'
            label={<span className='font-medium'>{t('selectModelToCheck')}</span>}
          >
            <Select
              options={
                modelList.length > 0 
                  ? modelList.map(i => ({ value: i.id, label: i.displayName }))
                  : [{ value: '', label: t('noModelsAvailable') }]
              }
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default CheckApiModal;