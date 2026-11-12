---
'@ebuckleyk/frost-ui': patch
---

Questionnaire: controlled `QuestionnaireChoice` and `QuestionnaireInput` edits now count as answers only once the parent applies them, so rejected edits no longer pass required validation or submit empty fields. `QuestionnaireItem` also picks up `required` and `disabled` prop changes after mount.
