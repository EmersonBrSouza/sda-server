function filterAllowedMembers (members) {
    
  Object.keys(members).map((item) => {
    if (members[item]  === false) delete members[item]
    return members[item]
  })

  return Object.keys(members)
}

module.exports = { filterAllowedMembers }