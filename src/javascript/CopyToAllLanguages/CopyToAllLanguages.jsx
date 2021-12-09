import React, {useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Button, Checkbox, Input, Loading, Typography} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import styles from './CopyToAllLanguages.scss';
import {useMutation, useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

export const CopyToAllLanguages = ({path, property, isOpen, onExited, onClose}) => {
    const {t} = useTranslation('copy-to-all-languages');
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState('');
    const {language} = useSelector(state => ({
        language: state.language
    }));

    const {data, error, loading} = useQuery(gql`query($path:String!, $language: String, $property: String!) {
        jcr {
            nodeByPath(path: $path) {
                uuid
                workspace
                path
                property(name: $property, language: $language) {
                    value
                }
                site {
                    uuid
                    workspace
                    path
                    languages {
                        language
                        displayName
                    }
                }
            }
        }
    }`, {
        variables: {path, language, property}
    });

    if (error) {
        console.log(error);
    }

    const [updateLang] = useMutation(gql`mutation ($path:String!, $property: String!, $language: String, $value: String!) {
        jcr {
            mutateNode(pathOrId: $path) {
                mutateProperty(name: $property) {
                    setValue(language: $language, value: $value)
                }
            }
        }
    }`, {
        variables: {path, property}
    });

    const doCopy = selected => {
        if (data) {
            selected.forEach(language => {
                updateLang({
                    variables: {
                        language,
                        value: data.jcr.nodeByPath.property.value
                    }
                });
            });
        }
    };

    const allLanguages = data ? data.jcr.nodeByPath.site.languages.filter(l => l.language !== language) : [];

    return (
        <Dialog fullWidth
                open={isOpen}
                aria-labelledby="form-dialog-title"
                data-cm-role="export-options"
                onExited={onExited}
                onClose={onClose}
        >
            <DialogTitle>
                {t('copy-to-all-languages:label.dialogTitle', {propertyName: property})}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div className={styles.subheading}>
                        <Typography>{t('copy-to-all-languages:label.dialogDescription')}</Typography>
                    </div>
                    <div className={styles.actions}>
                        <Button size="default"
                                label={t('copy-to-all-languages:label.addAll')}
                                onClick={() => data && setSelected(allLanguages.map(l => l.language))}/>
                        <Button size="default"
                                label={t('copy-to-all-languages:label.removeAll')}
                                onClick={() => data && setSelected([])}/>
                        <div className="flexFluid"/>
                        <Typography>{t('copy-to-all-languages:label.languagesSelected', {count: selected.length})}</Typography>
                    </div>
                    <div className={styles.actions}>
                        <Input variant="search"
                               value={filter}
                               onChange={e => {
                                   setFilter(e.target.value);
                               }}
                               onClear={() => setFilter('')}/>
                    </div>
                    <div className={styles.languages}>
                        {loading && <Loading size="big"/>}
                        {allLanguages
                            .filter(l => !filter || l.language.indexOf(filter) > -1 || l.displayName.indexOf(filter) > -1)
                            .map(l => (
                                <label key={l.language} className={styles.item}>
                                    <Checkbox checked={selected.indexOf(l.language) > -1}
                                              name="lang"
                                              value={l.language}
                                              aria-label={l.displayName}
                                    />
                                    {l.displayName}
                                </label>
                                )
                            )}
                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button size="big" label={t('copy-to-all-languages:label.cancel')} onClick={onClose}/>
                <Button
                    size="big"
                    color="accent"
                    data-cm-role="export-button"
                    label={t('copy-to-all-languages:label.copy')}
                    onClick={() => {
                        doCopy(selected);
                    }}
                />
            </DialogActions>
        </Dialog>
    );
};

CopyToAllLanguages.propTypes = {
    path: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onExited: PropTypes.func,
    onClose: PropTypes.func
};
