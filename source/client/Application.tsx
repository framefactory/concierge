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

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";

import { ThemeProvider } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Navigator from "./components/Navigator";
import Header from "./components/Header";

import { theme } from "./components/theme";

////////////////////////////////////////////////////////////////////////////////

/** Properties for [[Application]] component. */
export interface IApplicationProps
{
    classes: {
        root: string;
        appContent: string;
        mainContent: string;
    };
}

export interface IApplicationState
{
    isNavigatorOpen: boolean;
}

const styles: any = theme => ({
    root: {
        display: 'flex',
        minHeight: '100vh',
    },

    appContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    mainContent: {
        flex: 1,
        padding: '48px 36px 0',
        background: '#eaeff1',
    },
});

class Application extends React.Component<IApplicationProps, IApplicationState>
{
    protected client: ApolloClient<any>;

    constructor(props: IApplicationProps)
    {
        super(props);

        this.toggleNavigator = this.toggleNavigator.bind(this);

        this.state = {
            isNavigatorOpen: false,
        };

        this.client = new ApolloClient({
            link: new HttpLink({ uri: "/graphql" }),
            cache: new InMemoryCache(),
            name: "concierge-web-client",
        });
    }

    render()
    {
        const { classes } = this.props;

        return (
            <ThemeProvider theme={theme}>
                <ApolloProvider client={this.client}>
                    <div className={classes.root}>
                        <CssBaseline />
                        <Navigator
                            open={this.state.isNavigatorOpen}
                            onClose={this.toggleNavigator}
                        />
                        <div className={classes.appContent}>
                            <Header onDrawerToggle={this.toggleNavigator} />
                            <main className={classes.mainContent}>

                            </main>
                        </div>
                    </div>
                </ApolloProvider>
            </ThemeProvider>
        );
    }

    protected toggleNavigator()
    {
        this.setState(state => ({ isNavigatorOpen: !state.isNavigatorOpen }));
    }
}

export default withStyles(styles)(Application);