var id;
function roleUpdate(callZome, fn, role, address) {
  return callZome('__H_Wiki', 'wiki', fn)
  ({role_name: role, agent_address: address})
}

export const resolvers = {
  Query: {
    async page(_, { title }, __) {
      return title;
    },
    allPages(_, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_titles')
        ({})
        .then(page => {
          page = JSON.parse(page);
          if (page.Ok) {
            return page.Ok;
          } else {
            return [];
          }
        });
    },
    allUsers(_, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_usernames')
      ({})
      .then(page => {
        page = JSON.parse(page);
        if (page.Ok) {
          return page.Ok;
        } else {
          return [];
        }
      });
    },
    getId(_,__,{ callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_username')
        ({})
        .then(res => {
          console.log(res);
          res = JSON.parse(res).Ok;

          if (res) {
            return res;
          } else {
            return  ""
          }
        });
    },
    getPageTitle(_,{title}, {callZome}) {
      return callZome('__H_Wiki', 'wiki', 'get_titles_filtered')
        ({data: title})
        .then(titles => {
          return JSON.parse(titles).Ok
        });
    },
    getUsername(_,{username}, {callZome}) {
      return callZome('__H_Wiki', 'wiki', 'get_users')
        ({data: username})
        .then(usernames => {
          return JSON.parse(usernames).Ok
        });
    },
    getUserInfo(_,{username}, {callZome}) {
      return callZome('__H_Wiki', 'wiki', 'get_users')
        ({data: username})
        .then(usernames => {
          return JSON.parse(usernames).Ok
        });
    }
  },
  User: {
    userName: userName => userName,
    id(user_name, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_agent_user')
      ({ user_name })
        .then(page => {
          page = JSON.parse(page);
          return page.Ok
        })
        
    },
    role(user_name, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_agent_user')
      ({ user_name })
        .then(page => {
          page = JSON.parse(page);
          if (page.Ok) {
            console.log(page);
            return callZome('__H_Wiki', 'wiki', 'get_agent_roles'
            )({ agent_address: page.Ok }).then((roles) => {
              roles = JSON.parse(roles).Ok;
              return roles;
            });
          } else {
            throw new Error(page.Err);
          }
        })
        .catch((e) => {
          return 'Reader'
        });
    }
  },
  Role: {
    name: ({ role_name }) => role_name,
    members({ members }, __, { callZome }) {
      return members.map(id =>
        callZome(
          '__H_Wiki', 'wiki', 
          'get_user_by_agent_id'
        )({ agent_id: id }).then(page => {
          page = JSON.parse(page);

          if (page.Ok) {
            return page.Ok;
          } else {
            throw new Error(page.Err);
          }
        })
      );
    }
  },
  Page: {
    title(title) {
      return title;
    },
    sections(title, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_page'
      )({ title: title }).then(page => {
        page = JSON.parse(page);

        if (page.Ok) {
          return page.Ok.sections;
        } else {
          throw new Error(page.Err);
        }
      });
    }
  },
  Section: {
    id(id) {
      return id;
    },
    type(id, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_section'
      )({ address: id }).then(page => {
        page = JSON.parse(page);
        if (page.Ok) {
          return page.Ok.type;
        } else {
          throw new Error(page.Err);
        }
      });
    },
    content(id, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_section'
      )({ address: id }).then(page => {
        page = JSON.parse(page);
        if (page.Ok) {
          return page.Ok.content;
        } else {
          throw new Error(page.Err);
        }
      });
    },
    rendered_content(id, __, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'get_section'
      )({ address: id }).then(page => {
        page = JSON.parse(page);
        if (page.Ok) {
          return page.Ok.rendered_content;
        } else {
          throw new Error(page.Err);
        }
      });
    }
  },
  Mutation: {
    async createPageWithSections(a, { title, sections }, { callZome }) {
      console.log('Resolver createPageWithSections: ', sections);
      return callZome('__H_Wiki', 'wiki', 'create_page_with_sections')
      ({ title, sections, timestamp: parseInt(Date.now()) }).then(res => {
        console.log(res);
        if (JSON.parse(res).Ok) {
          return title;
        } else {
          throw new Error(JSON.parse(res).Err);
        }
      });
    },

    async addSectionToPage(a, { title, section }, { callZome }) {
      await callZome(
        '__H_Wiki', 'wiki', 
        'add_section'
      )({ title, element: section }).then(res => {
        id = [JSON.parse(res).Ok];
      });

      return callZome('__H_Wiki', 'wiki', 'update_page'
      )({ sections: id, title, timestamp: parseInt(Date.now()) }).then(res => {
        if (JSON.parse(res).Ok) {
          return title;
        } else {
          throw new Error(JSON.parse(res).Err);
        }
      });
    },

    async addOrderedSectionToPage(
      a,
      { title, beforeSection, section, sections, mode },
      { callZome }
    ) {
      await callZome(
        '__H_Wiki', 'wiki', 
        'add_section'
      )({ title, element: section }).then(res => {
        id = JSON.parse(res).Ok;
      });

      if (mode === 'addsa') {
        let sectionsUpdate;
        sectionsUpdate = [id, ...sections];
        sections = [];
        sections = sectionsUpdate;
      } else if (mode === 'addsb') {
        let i = parseInt(sections.indexOf(beforeSection));
        i += 1;
        sections.splice(i, 0, id);
      }

      return callZome('__H_Wiki', 'wiki', 'update_page'
      )({ sections, title, timestamp: parseInt(Date.now()) }).then(res => {
        if (JSON.parse(res).Ok) {
          return title;
        } else {
          throw new Error(JSON.parse(res).Err);
        }
      });
    },

    async updateSection(a, { id, section }, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'update_element'
      )({ address: id, element: section }).then(res => {
        if (JSON.parse(res).Ok) {
          return id;
        } else {
          throw new Error(JSON.parse(res).Err);
        }
      });
    },

    async removeSection(a, { id }, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'delete_element'
      )({ address: id }).then(res => {
        if (JSON.parse(res).Ok) {
          return JSON.parse(res).Ok;
        } else {
          throw new Error(JSON.parse(res).Err);
        }
      });
    },
    async createUser(a, { name }, { callZome }) {
      return callZome('__H_Wiki', 'wiki', 'create_user'
      )({ data: name })
      .then(res => {
        if (JSON.parse(res).Ok) {
          return JSON.parse(res).Ok;
        } else {
          throw new Error(JSON.parse(res).Err);
        }
      });
    },
    async roleUpdate(a, {currentRole, agentAddress, newRole}, { callZome }) {
      if (currentRole === 'Reader') {
        return roleUpdate(callZome, 'assign_role', newRole, agentAddress)
        .then(res => newRole)
      } else {
        return roleUpdate(callZome, 'unassign_role', currentRole, agentAddress)
          .then(res =>{
            if (newRole !== 'Reader') {
              return roleUpdate(callZome, 'assign_role', newRole, agentAddress)
              .then(res => newRole)
            } else {
              return true;
            }
          })
          .catch(res => currentRole);
      }
    }
  }
};
