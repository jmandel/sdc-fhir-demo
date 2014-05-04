from lxml import objectify
import json
import copy
import sys

qq = json.load(open("app/fixtures/template-questionnaire.json"))
vs = json.load(open("app/fixtures/template-valueset.json"))

class Section(object):
    def __init__(self, e):
        self.e = e

    @property
    def instructions(self):
        try: 
            return str(self.e.section_instruction["{http://www.iso.org/19763/13/2013}label"])
        except:
            return None

    @property
    def questions(self):
        try:
            return [Question(q) for q in self.e.question]
        except:
            return []

class Question(object):
    def __init__(self, q):
        self.q = q

    @property
    def prompt(self):
        return str(self.q.question_prompt["{http://www.iso.org/19763/13/2013}label"])

    @property
    def multiple(self):
        if hasattr(self.q, 'text_field'):
            return  bool(self.q.text_field["{http://www.iso.org/19763/13/2013}multiselect"])
        if hasattr(self.q, 'list_field'):
            return  bool(self.q.list_field["{http://www.iso.org/19763/13/2013}multiselect"])
        raise "can't find cardinaltiy"
    
    @property
    def datatype(self):
        try:
            if hasattr(self.q.text_field.datatype, 'string_date'): return 'date'
            return 'string'
        except: 
            return 'string'

    @property
    def choices(self):
        if not hasattr(self.q, 'list_field'): return []
        return [Code(i) for i in self.q.list_field.list_item]

class Code(object):
    def __init__(self, c):
        self.c = c

    def __str__(self):
        return self.code +":"+self.display

    @property
    def code(self):
        return str(self.c["{http://www.iso.org/19763/13/2013}value"])

    @property
    def display(self):
        if self.c["{http://www.iso.org/19763/13/2013}item_prompt"]:
            return str(self.c["{http://www.iso.org/19763/13/2013}item_prompt"].label)
        if self.c["{http://www.iso.org/19763/13/2013}value_meaning"]:
            return str(self.c["{http://www.iso.org/19763/13/2013}value_meaning"].label)
        return "nolabel"

valueSetNumber = 0
def makeValueSet(codes):
    global valueSetNumber
    valueSetNumber += 1
    vsname = 'vs-'+str(valueSetNumber)
    template = copy.deepcopy(vs)
    template['id'] = vsname 
    template['name'] = vsname
    for c in codes:
        template['expansion']['contains'].append({
            'code': c.code,
            'display': c.display    
    })
    qq['contained'].append(template)
    return vsname

def makeQuestion(question):
    template = {'extension': []}
    template['text'] = question.prompt
    template['extension'].append({
        'url': 'http://sdc/multipleCardinality',
        'valueBoolean': question.multiple
    })
    template['extension'].append({
        'url': 'http://hl7.org/fhir/questionnaire-extensions#answerFormat',
        'valueCode': question.datatype
    })
    if (question.choices):
        template['options'] = {'reference': '#'+makeValueSet(question.choices)}
    return template

def makeGroup(section):
    template = {}
    if section.instructions:
        template['header'] = section.instructions
    template['question'] = [
        makeQuestion(q) for q in section.questions        
    ]
    return template


if __name__ == "__main__":
    filename = sys.argv[1]
    f = open(filename).read()
    root = objectify.fromstring(f)

    sections = [root.form_design.header] + list(root.form_design.section) + [root.form_design.footer]
    sections = [Section(s) for s in sections]

    for section in sections:
        qq['group']['group'].append(makeGroup(section))
        qq['group']['header'] = str(root.form_design.designation.sign)
    print json.dumps(qq, indent=2)
