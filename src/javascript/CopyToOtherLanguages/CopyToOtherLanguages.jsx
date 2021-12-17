import React, {useEffect, useMemo, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Button, Checkbox, Input, Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './CopyToOtherLanguages.scss';
import {useMutation, useQuery} from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import {getMutation, getQuery} from './CopyToOtherLanguages.gql';

export const CopyToOtherLanguages = ({path, language, siteLanguages, field, isOpen, onExited, onClose}) => {
    const {t} = useTranslation('copy-to-other-languages');
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState('');
    const [errorState, setErrorState] = useState('');

    const allLanguages = useMemo(() => siteLanguages.filter(l => l.language !== language), [siteLanguages, language]);

    const {data, error} = useQuery(getQuery(allLanguages, path), {
        errorPolicy: 'ignore',
        variables: {path, language, property: field.propertyName}
    });

    const [updateLang] = useMutation(getMutation(allLanguages), {
        variables: allLanguages.reduce((acc, l) => ({
            ...acc,
            [`include_value_${l.language}`]: false,
            [`include_values_${l.language}`]: false
        }), {path, property: field.propertyName}),
        onError: error => {
            setErrorState(error);
        },
        onCompleted: () => {
            onClose();
        }
    });

    if (error) {
        console.log(error);
    }

    const doCopy = selected => {
        if (data) {
            let variables = {
                language,
                value: data.jcr.nodeByPath.property.value || '',
                values: data.jcr.nodeByPath.property.values || []
            };

            const multiple = (data.jcr.nodeByPath.property.value === null) ? 'values' : 'value';
            selected.forEach(l => {
                variables[`include_${multiple}_${l}`] = true;
            });

            updateLang({
                variables
            });
        }
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

    return (
        <>
            <Dialog fullWidth
                    open={isOpen}
                    aria-labelledby="form-dialog-title"
                    data-cm-role="export-options"
                    onExited={onExited}
                    onClose={onClose}
            >
                <DialogTitle>
                    {t('copy-to-other-languages:label.dialogTitle', {propertyName: field.displayName})}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <div className={styles.subheading}>
                            <Typography>{t('copy-to-other-languages:label.dialogDescription')}</Typography>
                        </div>
                        <div className={styles.actions}>
                            <Button size="default"
                                    label={t('copy-to-other-languages:label.addAll')}
                                    isDisabled={filteredAndAvailable.every(v => selected.includes(v))}
                                    onClick={() => data && setSelected(filteredAndAvailable)}/>
                            <Button size="default"
                                    label={t('copy-to-other-languages:label.removeAll')}
                                    isDisabled={selected.length === 0}
                                    onClick={() => data && setSelected([])}/>
                            <div className="flexFluid"/>
                            <Typography>{t('copy-to-other-languages:label.languagesSelected', {count: selected.length})}</Typography>
                        </div>
                        <div className={styles.actions}>
                            <Input variant="search"
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
                    <Button size="big" label={t('copy-to-other-languages:label.cancel')} onClick={onClose}/>
                    <Button
                    size="big"
                    isDisabled={selected.length === 0}
                    color="accent"
                    data-cm-role="export-button"
                    label={t('copy-to-other-languages:label.copy')}
                    onClick={() => {
                        doCopy(selected);
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
                    <DialogContentText id="alert-dialog-description">{t('copy-to-other-languages:label.errorContent', {property: field.displayName})}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button label={t('copy-to-other-languages:label.cancel')}
                            color="accent"
                            size="big"
                            onClick={() => setErrorState()}
                    />
                </DialogActions>
            </Dialog>
        </>
    );
};

CopyToOtherLanguages.propTypes = {
    path: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    siteLanguages: PropTypes.array.isRequired,
    field: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,
    onExited: PropTypes.func,
    onClose: PropTypes.func
};
