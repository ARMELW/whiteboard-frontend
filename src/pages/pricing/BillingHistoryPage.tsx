import { useBillingHistory } from '@/app/subscription/hooks';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

export function BillingHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading, error } = useBillingHistory(page, limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">
          Erreur lors du chargement de l'historique de facturation
        </p>
      </div>
    );
  }

  const hasNextPage = data && page * limit < data.total;
  const hasPrevPage = page > 1;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Historique de facturation</h1>

      {data?.data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Aucune facture disponible</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(invoice.date), 'dd MMMM yyyy', {
                        locale: fr,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.planId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.amount} {invoice.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status === 'paid'
                          ? 'Payé'
                          : invoice.status === 'pending'
                          ? 'En attente'
                          : 'Échec'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {invoice.invoiceUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(invoice.invoiceUrl, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.total > limit && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage {(page - 1) * limit + 1} à{' '}
                {Math.min(page * limit, data.total)} sur {data.total} factures
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrevPage}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNextPage}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
