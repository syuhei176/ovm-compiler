const text = "// OVM language grammar\n// ==========================\n//\n\n{\n\n}\n\nProgram\n  = Declation*\n\nDeclation\n  = \"def\" _ dec:Decider _ \":=\" _ s:Statement _ {\n    return {\n      name: dec.predicate,\n      inputDefs: dec.inputs,\n      body: s[0]\n    }\n  }\n\nStatement\n  = expr:Expression tail:(Expression)*\n\nPredicate\n  = UniversalQuantifier / ThereExistsQuantifier / NotPredicate / Decider\n\nNoArgs\n  = \"(\" _ \")\" {\n    return []\n  }\n\nArgsExist\n  = \"(\" arg:Arg args:(\",\" _ Arg)* \")\" {\n    return [arg].concat(args.map((a) => a[2]))\n  }\n\nArgs\n  = ArgsExist / NoArgs\n\nDecider\n  = name:String _ args:Args {\n  return {\n    type: 'PropertyNode',\n    predicate: name,\n    inputs: args\n  }\n}\n  \nUniversalQuantifier\n  = \"for\" _ v:String _ \"in\" _ V:Decider _ \"{\" _ property:Expression _ \"}\" {\n    return {\n      type: 'PropertyNode',\n      predicate: \"ForAllSuchThat\",\n      inputs: [\n        V,\n        v,\n        property\n      ]\n    }\n  }\n\nThereExistsQuantifier\n  = \"with\" _ Q:Decider _ \"as\" _ v:String _ \"{\" _ property:Expression _ \"}\" {\n    return {\n      type: 'PropertyNode',\n      predicate: \"ThereExistsSuchThat\",\n      inputs: [\n        Q,\n        v,\n        property\n      ]\n    }\n  }\n\nNotPredicate\n  = \"!\" _ property:Factor {\n    return {\n      type: 'PropertyNode',\n      predicate: \"Not\",\n      inputs: [\n        property\n      ]\n    }\n  }\n\nExpression\n  = head:Factor tail:(_ (\"and\" / \"or\") _ Factor)* {\n      if(tail.length > 0) {\n        const op = tail[0][1]\n        const items = tail.map((t) => t[3])\n        return {\n          type: 'PropertyNode',\n          predicate: op == \"and\" ? \"And\" : \"Or\",\n          inputs: [head].concat(items)\n        }\n      } else {\n        return head;\n      }\n    }\n\nFactor\n  = \"(\" _ expr:Expression _ \")\" { return expr }\n  / Predicate\n\nInteger \"integer\"\n  = _ [0-9]+ { return parseInt(text(), 10); }\n\nArg\n  = parent:String children:(\".\" (Integer / \"address\"))* {\n    return parent + children.map(c => '.' + c[1]).join('')\n  }\n\nString \"string\"\n  = _ \"$\"?[a-zA-Z0-9_]+ { return text(); }\n\n_ \"whitespace\"\n  =  [ \\t\\n\\r]*\n"
export default text