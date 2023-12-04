import useWalletSelector from '@hooks/useWalletSelector';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const RouteContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  width: 360px;
  margin: auto;
  background-color: ${(props) => props.theme.colors.elevation0};
  border: 1px solid rgba(126, 137, 171, 0.2);
  box-shadow: 0px 8px 28px rgba(0, 0, 0, 0.35);
`;

const TestnetContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: props.theme.colors.elevation1,
  paddingTop: props.theme.spacing(3),
  paddingBottom: props.theme.spacing(3),
}));

const TestnetText = styled.h1((props) => ({
  ...props.theme.body_xs,
  textAlign: 'center',
  color: props.theme.colors.white_200,
}));

function ScreenContainer(): JSX.Element {
  const { network } = useWalletSelector();
  const { t } = useTranslation('translation');

  return (
    <RouteContainer className="optionsContainer">
      {network.type === 'Testnet' && (
        <TestnetContainer>
          <TestnetText>{t('SETTING_SCREEN.TESTNET')}</TestnetText>
        </TestnetContainer>
      )}
      <Outlet />
    </RouteContainer>
  );
}

export default ScreenContainer;
