import useSendBtcRequest from '@hooks/useSendBtcRequest';
import useWalletSelector from '@hooks/useWalletSelector';
import {
  getBtcFiatEquivalent,
} from '@secretkeylabs/xverse-core';
import BigNumber from 'bignumber.js';
import {
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

const OuterContainer = styled.div`
  display: flex;
  flex:1 ;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

function BtcSendScreen() {
  const {
    payload,
    signedTx,
    isLoading,
    tabId,
    requestString,
  } = useSendBtcRequest();
  const { t } = useTranslation('translation', { keyPrefix: 'SEND' });
  const navigate = useNavigate();
  const {
    btcFiatRate,
  } = useWalletSelector();

  useEffect(() => {
    if (signedTx) {
      const parsedAmountSats = new BigNumber(payload.satsAmount);
      navigate('/confirm-btc-tx', {
        state: {
          signedTxHex: signedTx.signedTx,
          recipientAddress: payload.recipientAddress,
          amount: payload.satsAmount,
          recipient: [
            {
              address: payload?.recipientAddress,
              amountSats: new BigNumber(payload?.satsAmount),
            },
          ],
          fiatAmount: getBtcFiatEquivalent(parsedAmountSats, btcFiatRate),
          fee: signedTx.fee,
          fiatFee: getBtcFiatEquivalent(signedTx.fee, btcFiatRate),
          total: signedTx.total,
          fiatTotal: getBtcFiatEquivalent(signedTx.total, btcFiatRate),
          btcSendBrowserTx: true,
          requestString,
          tabId,
        },
      });
    }
  }, [signedTx]);
  return (
    <OuterContainer>
      { isLoading && <MoonLoader color="white" size={50} />}
    </OuterContainer>
  );
}

export default BtcSendScreen;