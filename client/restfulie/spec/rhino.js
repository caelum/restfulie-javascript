load('../../jspec/spec/support/env.js')
load('../../jspec/spec/support/jquery.js')
load('../../jspec/lib/jspec.xhr.js')

load('../../jspec/lib/jspec.js')
load('../../jspec/lib/jspec.xhr.js')
load('../../restfulie/lib/restfulie.js')
load('../../restfulie/lib/json2.js')
load('../../restfulie/lib/jquery-1.4.2.min.js')
load('../../restfulie/lib/jquery.xml2json.js')
load('../../restfulie/spec/unit/spec.helper.js')

JSpec
.exec('../../restfulie/spec/unit/spec.js')
.run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures' })
.report()