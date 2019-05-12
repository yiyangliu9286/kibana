/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { Datatable, ContextFunction } from '../types';
import { getFunctionHelp } from '../../strings';

interface Arguments {
  fn: (datatable: Datatable) => Promise<boolean>;
}

export function filterrows(): ContextFunction<
  'filterrows',
  Datatable,
  Arguments,
  Promise<Datatable>
> {
  const { help, args: argHelp } = getFunctionHelp().filterrows;

  return {
    name: 'filterrows',
    aliases: [],
    type: 'datatable',
    context: {
      types: ['datatable'],
    },
    help,
    args: {
      fn: {
        resolve: false,
        aliases: ['_'],
        types: ['boolean'],
        help: argHelp.fn,
      },
    },
    fn(context, { fn }) {
      const checks = context.rows.map(row =>
        fn({
          ...context,
          rows: [row],
        })
      );

      return Promise.all(checks)
        .then(results => context.rows.filter((row, i) => results[i]))
        .then(
          rows =>
            ({
              ...context,
              rows,
            } as Datatable)
        );
    },
  };
}
