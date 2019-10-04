/**
 * 3D Foundation Project
 * Copyright 2019 Smithsonian Institution
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { NavLink } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


////////////////////////////////////////////////////////////////////////////////

const styles = theme => ({

});

export interface IHeaderTab
{
    text: string;
    link: string;
}

export interface IHeaderProps
{
    title: string;
    tabs: IHeaderTab[];
    match: any;

    classes: {
        secondaryBar: string;
        menuButton: string;
        iconButtonAvatar: string;
        link: string;
        button: string;
        avatar: string;
    };

    onNavigatorToggle: () => void;
}

function TabLink(props) {
    const { label, to, value } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef((itemProps, ref) => (
                <NavLink to={to} {...itemProps} innerRef={ref} />
            )),
        [to],
    );

    return (
        <Tab component={renderLink} label={label} value={value} />
    );
}

class Header extends React.Component<IHeaderProps, {}>
{
    render()
    {
        const { classes, title, tabs, onNavigatorToggle, match } = this.props;

        console.log("MATCH", match.path, match.url);
        console.log("TABS", tabs[0].link);

        return (
            <React.Fragment>
                <AppBar
                    position="static"
                    elevation={0}
                >
                    <Toolbar>
                        <Hidden smUp>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onNavigatorToggle}
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                    </Toolbar>
                    <Toolbar>
                        <Typography color="inherit" variant="h5" component="h1">
                            {title}
                        </Typography>
                    </Toolbar>
                    <Tabs value={match.path}>
                        {tabs.map(tab => (
                            <TabLink key={tab.text} label={tab.text} to={tab.link} value={tab.link} />
                        ))}
                    </Tabs>
                </AppBar>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Header);