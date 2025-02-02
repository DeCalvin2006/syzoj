(async () => {
  require('.');
  const JudgeState = syzoj.model('judge_state');
  const FormattedCode = syzoj.model('formatted_code');
  const CodeFormatter = syzoj.lib('code_formatter');

  for (let i = 1; i < 20643; i++) {
    const judge_state = await JudgeState.fromID(i);
    if (!judge_state) continue;

    if (!judge_state.language) continue;

    const key = syzoj.utils.getFormattedCodeKey(judge_state.code, judge_state.language);
    if (!key) continue;

    let formatted_code = await FormattedCode.findOne({ where: { key: key } });

    const code = await CodeFormatter(judge_state.code, syzoj.languages[judge_state.language].format);
    if (code === null) {
      console.error(`Format ${i} failed.`);
      continue;
    }

    if (!formatted_code) {
      formatted_code = await FormattedCode.create({
        key: key,
        code: code
      });
    } else continue; // formatted_code.code = code;

    try {
      await formatted_code.save();
      console.error(`Format and save ${i} success.`);
    } catch (e) {
      console.error(`Save ${i} failed:`, e);
    }
  }
})();
