import React, {useEffect, useMemo, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Button, Checkbox, Input, Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './CopyToOtherLanguages.scss';
import {useQuery} from '@apollo/client';
import PropTypes from 'prop-types';
import {getQuery} from './CopyToOtherLanguages.gql';
import WarningAlert from './WarningAlert';

export const CopyToOtherLanguages = ({
    path,
    language,
    setI18nContext,
    siteLanguages,
    field,
    fieldValue,
    fields,
    isOpen,
    isNew,
    onExited,
    onClose}) => {
    const {t} = useTranslation('copy-to-other-languages');
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState('');
    const [errorState, setErrorState] = useState('');
    const [warningModalShown, setWarningModalShown] = useState(false);
    const isSingleField = !fields;

    const allLanguages = useMemo(() => siteLanguages.filter(l => l.language !== language), [siteLanguages, language]);

    const {data, error} = useQuery(getQuery(allLanguages, path), {
        errorPolicy: 'ignore',
        variables: {path}
    });

    if (error) {
        console.log(error);
    }

    /**
     * For each copy-to language, do a deep copy of previous i18nContext
     * and add field value to the values object in i18nContext
     * @param selected list of languages to copy to
     */
    const doCopy = selected => {
        setI18nContext(prev => {
            prev = prev || {};
            if (Object.hasOwn(prev, language)) {
                // If we do multiple copy to languages in a row
                // then old values will be saved in i18nContext
                // and rewritten back to formik
                delete prev[language];
            }

            const result = selected.reduce((acc, lang) => ({
                ...acc,
                [lang]: ({
                    ...prev[lang],
                    values: (isSingleField) ? {
                        ...(prev[lang] || {}).values,
                        [field.name]: fieldValue
                    } : {
                        ...(prev[lang] || {}).values,
                        ...fields
                    },
                    validation: {
                        ...(prev[lang] || {}).validation
                    }
                })
            }), {});
            return {...prev, ...result};
        });
    };

    const available = useMemo(() => {
        const disabledLanguages = data ? allLanguages.filter(l => !data.jcr.nodeByPath[`perm_${l.language}`] || (data.jcr[`lock_${l.language}`] && data.jcr[`lock_${l.language}`].lockInfo.details.length > 0)) : allLanguages;
        return allLanguages.filter(l => !disabledLanguages.includes(l)).map(l => l.language);
    }, [data, allLanguages]);

    useEffect(() => {
        setSelected(available);
    }, [available]);

    const filtered = allLanguages.filter(l => !filter || l.language.includes(filter) || l.displayName.includes(filter));
    const filteredAndAvailable = filtered.map(l => l.language).filter(l => available.includes(l));
    const selectedDisplayNames = filtered.filter(l => selected.includes(l.language)).map(l => l.displayName).join(', ');
    const currentDisplayName = siteLanguages.find(l => l.language === language)?.displayName;

    const title = isSingleField ? t('copy-to-other-languages:label.dialogTitle', {propertyName: field.displayName}) : t('copy-to-other-languages:label.dialogTitleAllProperties');
    const description = isSingleField ? t('copy-to-other-languages:label.dialogDescription') : t('copy-to-other-languages:label.dialogDescriptionAllProperties');
    const errorDescription = isSingleField ? t('copy-to-other-languages:label.errorContent', {property: field.displayName}) : t('copy-to-other-languages:label.errorContentAllProperties');

    return (
        <>
            <Dialog fullWidth
                    open={isOpen}
                    aria-labelledby="form-dialog-title"
                    data-sel-role="copy-language-dialog"
                    onExited={onExited}
                    onClose={onClose}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <div className={styles.subheading}>
                            <Typography>{description}</Typography>
                        </div>
                        <div className={styles.actions}>
                            <Button size="default"
                                    label={t('copy-to-other-languages:label.addAll')}
                                    data-sel-role="add-all-button"
                                    isDisabled={filteredAndAvailable.every(v => selected.includes(v))}
                                    onClick={() => data && setSelected(filteredAndAvailable)}/>
                            <Button size="default"
                                    label={t('copy-to-other-languages:label.removeAll')}
                                    data-sel-role="remove-all-button"
                                    isDisabled={selected.length === 0}
                                    onClick={() => data && setSelected([])}/>
                            <div className="flexFluid"/>
                            <Typography>{t('copy-to-other-languages:label.languagesSelected', {count: selected.length})}</Typography>
                        </div>
                        <div className={styles.actions}>
                            <Input variant="search"
                                   data-sel-role="language-filter"
                                   placeholder={t('copy-to-other-languages:label.filterLanguages')}
                                   value={filter}
                                   onChange={e => {
                                   setFilter(e.target.value);
                               }}
                                   onClear={() => setFilter('')}/>
                        </div>
                        <div className={styles.languages}>
                            {filtered.length > 0 ? filtered.map(l => (
                                <label key={l.language} className={styles.item}>
                                    <Checkbox checked={selected.includes(l.language)}
                                              data-sel-role="copy-language-button"
                                              isDisabled={!available.includes(l.language)}
                                              name="lang"
                                              value={l.language}
                                              aria-label={l.displayName}
                                              onChange={() => setSelected((selected.includes(l.language)) ?
                                              selected.filter(s => l.language !== s) :
                                              [...selected, l.language]
                                          )}
                                />
                                    {l.displayName} {data && !available.includes(l.language) && (' - ' + t('copy-to-other-languages:label.lock'))}
                                </label>
                          )
                        ) : (
                            <div className={styles.emptylanguages}><Typography>{t('copy-to-other-languages:label.noResults')}</Typography></div>
                        )}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size="big"
                            label={t('copy-to-other-languages:label.cancel')}
                            data-sel-role="cancel-button"
                            onClick={onClose}/>
                    <Button size="big"
                            isDisabled={selected.length === 0}
                            color="accent"
                            data-sel-role="copy-button"
                            label={t('copy-to-other-languages:label.copy')}
                            onClick={() => {
                                if (isNew || isSingleField) {
                                    doCopy(selected);
                                    onClose();
                                } else {
                                    setWarningModalShown(true);
                                }
                            }}
                    />
                </DialogActions>
            </Dialog>

            <Dialog
                maxWidth="lg"
                open={Boolean(errorState)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClose={() => setErrorState()}
            >
                <DialogTitle id="alert-dialog-title">{t('copy-to-other-languages:label.errorTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{errorDescription}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button label={t('copy-to-other-languages:label.cancel')}
                            color="accent"
                            size="big"
                            onClick={() => setErrorState()}
                    />
                </DialogActions>
            </Dialog>
            <WarningAlert
                languages={selectedDisplayNames}
                currentLanguage={currentDisplayName}
                isOpen={warningModalShown}
                onApply={() => {
                    doCopy(selected);
                    setWarningModalShown(false);
                    onClose();
                }}
                onClose={() => {
                    setWarningModalShown(false);
                }}
            />
        </>
    );
};

CopyToOtherLanguages.propTypes = {
    path: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    siteLanguages: PropTypes.array.isRequired,
    setI18nContext: PropTypes.func.isRequired,
    isNew: PropTypes.bool,
    field: PropTypes.object,
    fieldValue: PropTypes.string,
    fields: PropTypes.object,
    isOpen: PropTypes.bool,
    onExited: PropTypes.func,
    onClose: PropTypes.func
};
