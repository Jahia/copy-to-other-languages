import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@material-ui/core";
import {Button, Checkbox, Input, Typography} from "@jahia/moonstone";
import {useTranslation} from "react-i18next";
import styles from "./CopyToAllLanguages.scss"
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";

export const CopyToAllLanguages = ({path, isOpen, onExited, onClose}) => {
    const {t} = useTranslation('copy-to-all-languages');
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState("");

    const {data} = useQuery(gql`query($sitePath:String!) {
        jcr {
            nodeByPath(path: $sitePath) {
                ... on JCRSite {
                    languages {
                        language
                        displayName
                    }
                }
            }
        }
    }`, {
        variables: {
            sitePath: "/sites/digitall"
        }
    });

    return (
        <Dialog fullWidth open={isOpen} aria-labelledby="form-dialog-title" data-cm-role="export-options" onExited={onExited} onClose={onClose}>
            <DialogTitle>
                {t('copy-to-all-languages:label.dialogTitle', {propertyName: path})}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div className={styles.subheading}>
                        <Typography>{t('copy-to-all-languages:label.dialogDescription')}</Typography>
                    </div>
                    <div className={styles.actions}>
                        <Button size="default" label={t('copy-to-all-languages:label.addAll')} onClick={() => data && setSelected(data.jcr.nodeByPath.languages.map(l => l.language))}/>
                        <Button size="default" label={t('copy-to-all-languages:label.removeAll')} onClick={() => data && setSelected([])}/>
                        <div className="flexFluid"/>
                        <Typography>{t('copy-to-all-languages:label.languagesSelected', {count: selected.length})}</Typography>
                    </div>
                    <div className={styles.actions}>
                        <Input variant="search" value={filter} onChange={e => {setFilter(e.target.value)}} onClear={()=> setFilter("")}/>
                    </div>
                    <div className={styles.languages}>
                        {data && data.jcr.nodeByPath.languages
                            .filter(l => !filter || l.language.indexOf(filter) > -1 || l.displayName.indexOf(filter) > -1)
                            .map(l =>
                                <label className={styles.item}>
                                    <Checkbox checked={selected.indexOf(l.language) > -1}
                                              name={"lang"}
                                              value={l.language}
                                              aria-label={l.displayName}
                                    />
                                    {l.displayName}
                                </label>
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
                    }}
                />
            </DialogActions>
        </Dialog>
    );

}