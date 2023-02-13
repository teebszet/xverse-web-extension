import BottomModal from '@components/bottomModal';
import { useTranslation } from 'react-i18next';
import Cross from '@assets/img/dashboard/X.svg';
import styled from 'styled-components';
import OrdinalsIcon from '@assets/img/nftDashboard/oridinals_icon.svg';
import StacksIcon from '@assets/img/nftDashboard/stacks_icon.svg';
import { useNavigate } from 'react-router-dom';
import useWalletSelector from '@hooks/useWalletSelector';
import ReceiveCardComponent from './receiveCardComponent';

interface Props {
  visible: boolean;
  onClose: () => void;
  isGalleryOpen: boolean;
}

const ColumnContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: props.theme.spacing(12),
  marginBottom: props.theme.spacing(16),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'space-between',
  margin: '24px 24px 20px 24px',
});

const ButtonImage = styled.button({
  backgroundColor: 'transparent',
});

const Text = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  flex: 1,
}));

function ReceiveNftModal({ visible, onClose, isGalleryOpen }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'NFT_DASHBOARD_SCREEN' });
  const navigate = useNavigate();
  const { stxAddress, btcAddress } = useWalletSelector();
  const onReceivePress = () => {
    navigate('/receive/STX');
  };

  const onOrdinalsReceivePress = () => {
    navigate('/receive/BTC');
  };

  const receiveContent = (
    <ColumnContainer>
      <ReceiveCardComponent
        icon={StacksIcon}
        title={t('STACKS_NFT')}
        address={stxAddress}
        onQrAddressClick={onReceivePress}
      />
      <ReceiveCardComponent
        icon={OrdinalsIcon}
        title={t('ORDINALS')}
        address={btcAddress}
        onQrAddressClick={onOrdinalsReceivePress}
      />
    </ColumnContainer>
  );

  return isGalleryOpen ? (
    <>

      <RowContainer>
        <Text>{t('RECEIVE_NFT')}</Text>
        <ButtonImage onClick={onClose}>
          <img src={Cross} alt="cross" />
        </ButtonImage>
      </RowContainer>
      {receiveContent}
    </>
  ) : (
    <BottomModal visible={visible} header={t('RECEIVE_NFT')} onClose={onClose}>
      {receiveContent}
    </BottomModal>
  );
}

export default ReceiveNftModal;
