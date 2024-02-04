import InputScreen from '@components/inputScreen';
import { useBnsName, useBnsResolver } from '@hooks/queries/useBnsName';
import useDebounce from '@hooks/useDebounce';
// import { useBnsResolver } from '@hooks/queries/useBnsName';
// import useDebounce from '@hooks/useDebounce';
import useWalletSelector from '@hooks/useWalletSelector';
import { validateStacksAddress } from '@stacks/transactions';
import Button from '@ui-library/button';
import Input from '@ui-library/input';
import { FeedbackVariant } from '@ui-library/inputFeedback';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

type StxRecipientScreenProps = {
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  // recipientDomain: string;
  setRecipientDomain: (address: string) => void;
  memo: string;
  setMemo: (memo: string) => void;
  onNext: () => void;
  isLoading: boolean;
  header?: React.ReactNode;
};

const MemoInput = styled(Input)`
  input {
    height: 64px;
    padding-top: 0px;
  }
`;

const RecipientInput = styled(Input)`
  min-height: 125px;
`;

interface InputFeedback {
  variant: FeedbackVariant;
  message: string;
}

function Step1SelectRecipient({
  recipientAddress,
  setRecipientAddress,
  // recipientDomain,
  setRecipientDomain,
  memo,
  setMemo,
  onNext,
  isLoading,
  header,
}: StxRecipientScreenProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'SEND' });
  const { stxAddress } = useWalletSelector();
  const [inputFeedback, setInputFeedback] = useState<InputFeedback[] | undefined>();
  const [recipient, setRecipient] = useState(recipientAddress);

  const debouncedSearchTerm = useDebounce(recipient, 300);
  const associatedAddress = useBnsResolver(debouncedSearchTerm, stxAddress, 'STX');
  const associatedDomain = useBnsName(debouncedSearchTerm);

  useEffect(() => {
    setRecipientAddress(recipientAddress);
    setInputFeedback(undefined);

    if (associatedAddress !== '') {
      setRecipientAddress(associatedAddress);
      setRecipientDomain(recipient);
      setInputFeedback([
        { variant: 'checkmark', message: t('ASSOCIATED_ADDRESS') },
        { variant: 'plainIndented', message: associatedAddress },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associatedAddress]);

  useEffect(() => {
    setRecipientDomain('');
    setInputFeedback(undefined);

    if (associatedDomain !== '') {
      setRecipientDomain(associatedDomain);
      setRecipientAddress(recipient);
      setInputFeedback([
        { variant: 'checkmark', message: t('ASSOCIATED_DOMAIN') },
        { variant: 'plainIndented', message: associatedDomain },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [associatedDomain]);

  const handleNext = () => {
    if (stxAddress === recipientAddress) {
      setInputFeedback([{ variant: 'danger', message: t('ERRORS.SEND_TO_SELF') }]);
    } else if (validateStacksAddress(recipientAddress)) {
      onNext();
    } else {
      setInputFeedback([{ variant: 'danger', message: t('ERRORS.ADDRESS_INVALID') }]);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setRecipient(newValue);
    setInputFeedback(undefined);
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  };

  const inputElement = (
    <>
      <RecipientInput
        title={t('RECIPIENT')}
        placeholder={t('RECIPIENT_PLACEHOLDER')}
        value={recipient}
        onChange={handleAddressChange}
        variant={inputFeedback?.some((i) => i.variant === 'danger') ? 'danger' : 'default'}
        feedback={inputFeedback}
      />
      <MemoInput
        title={t('MEMO')}
        value={memo}
        onChange={handleMemoChange}
        feedback={[
          {
            variant: 'plain',
            message: t('MEMO_INFO'),
          },
        ]}
        hideClear
      />
    </>
  );

  const buttonElement = (
    <Button title={t('NEXT')} onClick={handleNext} disabled={!recipient} loading={isLoading} />
  );

  return <InputScreen inputs={inputElement} buttons={buttonElement} header={header} />;
}

export default Step1SelectRecipient;