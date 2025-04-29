import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Button, Typography, Warning} from '@jahia/moonstone';

const WarningAlert = ({
    languages,
    currentLanguage,
    isOpen,
    onApply,
    onClose}) => {
    const {t} = useTranslation('copy-to-other-languages');

    return (
        <Dialog maxWidth="md"
                open={isOpen}
                aria-labelledby="dialog-warningBeforeSave"
                data-sel-role="dialog-warningBeforeSave"
                onClose={onClose}
        >
            <DialogTitle id="dialog-warningBeforeSave">
                <Warning size="big" color="yellow"/>
                <Typography variant="heading">
                    {t('copy-to-other-languages:label.warning')}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    <Typography weight="semiBold">
                        {t('copy-to-other-languages:label.warningAllProperties', {languages, currentLanguage})}
                    </Typography>
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    size="big"
                    color="accent"
                    data-sel-role="content-type-dialog-apply"
                    label={t('copy-to-other-languages:label.copy')}
                    onClick={onApply}
                />
                <Button
                    size="big"
                    color="primary"
                    data-sel-role="content-type-dialog-cancel"
                    label={t('copy-to-other-languages:label.cancel')}
                    onClick={onClose}
                />
            </DialogActions>
        </Dialog>
    );
};

export default WarningAlert;

WarningAlert.propTypes = {
    languages: PropTypes.string.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired
};
