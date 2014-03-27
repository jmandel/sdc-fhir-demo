## SDC --> FHIR Questionnaire prototype

This is a rough take on the following process:

1. Ahead of time, transition SDC XML definitions into [FHIR
   Questionnaire](http://hl7.org/implement/standards/fhir/questionnaire.html)
instances.


2. Render FHIR questionnaires as web forms with client-side JavaScript

---

### To convert a file

```
$ python sdc_to_fhir.py   app/fixtures/sdc_example.xml  > app/fixtures/converted.json
```

### To run the app

Host the "app" directory with a web server of your choice (or `grunt serve` if
you're using nodejs). Then visit `/index.html#/view/:form` (where `:form` is
the name of an example FHIR Questionnaire JSON file that exists in `fixtures`

For instance:

* http://localhost:9000/index.html#/view/example
* http://localhost:9000/index.html#/view/converted

