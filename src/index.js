import { gql } from 'apollo-boost';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-boost';
import { ApolloClient } from 'apollo-boost';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { connect } from '@holochain/hc-web-client';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import * as serviceWorker from './serviceWorker';

async function start() {
    let defaultState = {
        client: null,
        userId: null
    };

    const store = createStore((state = defaultState, action) => {
        switch (action.type) {
            case 'SET_CLIENT':
                return { ...state, client: action.value }
            case 'SET_USERID':
                return { ...state, userId: action.value }
            default:
                return state
        }
    });

    const client = await connect(process.env.NODE_ENV === "development" ? { url: "ws://192.168.150.129:8888" } : undefined)
        .then((context) => {
            const schema = makeExecutableSchema({
                typeDefs,
                resolvers
            });
            const client = new ApolloClient({
                cache: new InMemoryCache(),
                link: new SchemaLink({ schema, context })
            });

            store.dispatch({
                type: 'SET_CLIENT',
                value: client
            });
            return client;
        });

    const userId = await client
        .query({
            query: gql`
            {
                myUser {
                id
                username
              }
            }
          `
        })
        .then(res => {
            return res.data.myUser


        }).catch(async e => {

            const query = client.mutate({
                mutation: gql`
                  mutation CreateUser(
                    $name: String!
                  ) {
                    createUser(name: $name) {
                        id
                        username
                    }
                  }
                `,
                variables: { name: "defaul_user" }
            })
            return (await query).data.createUser
        })
    store.dispatch({
        type: 'SET_USERID',
        value: userId
    });
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>
        , document.getElementById('root'));
}

start();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();