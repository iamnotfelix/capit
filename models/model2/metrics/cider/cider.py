from .cider_scorer import CiderScorer


class Cider:
    """
    Main Class to compute the CIDEr metric 

    """
    def __init__(self, test=None, refs=None, n=4, sigma=6.0):
        # set cider to sum over 1 to 4-grams
        self._n = n
        # set the standard deviation parameter for gaussian penalty
        self._sigma = sigma

    def compute_score(self, refs, hyps):
        """
        Main function to compute CIDEr score
        :param  hypo_for_image (dict) : dictionary with key <image> and value <tokenized hypothesis / candidate sentence>
                ref_for_image (dict)  : dictionary with key <image> and value <tokenized reference sentence>
        :return: cider (float) : computed CIDEr score for the corpus 
        """

        cider_scorer = CiderScorer(n=self._n, sigma=self._sigma)

        for hyp, ref in zip(hyps, refs):

            # Sanity check.
            assert(type(hyp) is str)
            assert(type(ref) is list)
            assert(len(ref) > 0)

            cider_scorer += (hyp, ref)

        (score, scores) = cider_scorer.compute_score()

        return score, scores

    def method(self):
        return "CIDEr"