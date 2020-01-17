const text = `// OVM language grammar
// ==========================
//

{

}

Program
  = Declation*

Declation
  = "def" _ dec:Decider _ ":=" _ s:Statement _ {
    return {
      name: dec.predicate,
      inputDefs: dec.inputs,
      body: s[0]
    }
  }

Statement
  = expr:Expression tail:(Expression)*

Predicate
  = UniversalQuantifier / ThereExistsQuantifier / NotPredicate / Decider

NoArgs
  = "(" _ ")" {
    return []
  }

ArgsExist
  = "(" arg:Arg args:("," _ Arg)* ")" {
    return [arg].concat(args.map((a) => a[2]))
  }

Args
  = ArgsExist / NoArgs

Decider
  = name:String _ args:Args {
  return {
    type: 'PropertyNode',
    predicate: name,
    inputs: args
  }
}
  
UniversalQuantifier
  = V:Decider ".all(" v:String _ "->" _ property:Expression _ ")" {
    return {
      type: 'PropertyNode',
      predicate: "ForAllSuchThat",
      inputs: [
        V,
        v,
        property
      ]
    }
  }

ThereExistsQuantifier
  = Q:Decider ".any(" v:String _ "->" _ property:Expression _ ")" {
    return {
      type: 'PropertyNode',
      predicate: "ThereExistsSuchThat",
      inputs: [
        Q,
        v,
        property
      ]
    }
  }

NotPredicate
  = "!" _ property:Factor {
    return {
      type: 'PropertyNode',
      predicate: "Not",
      inputs: [
        property
      ]
    }
  }

Expression
  = head:Factor tail:(_ ("and" / "or") _ Factor)* {
      if(tail.length > 0) {
        const op = tail[0][1]
        const items = tail.map((t) => t[3])
        return {
          type: 'PropertyNode',
          predicate: op == "and" ? "And" : "Or",
          inputs: [head].concat(items)
        }
      } else {
        return head;
      }
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr }
  / Predicate

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

Arg
  = parent:String children:("." (Integer / "address"))* {
    return parent + children.map(c => '.' + c[1]).join('')
  }

String "string"
  = _ "$"?[a-zA-Z0-9_]+ { return text(); }

_ "whitespace"
  = [ \\t\\n\\r]*
`
export default text